import {
    createElement,
    useState,
    useEffect,
    ReactElement,
    ChangeEvent,
    Fragment,
    KeyboardEvent,
    useCallback,
    useMemo,
    RefObject
} from "react";
import { WebIcon, ObjectItem } from "mendix";
import OptionsMenu from "./OptionMenu";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import { usePositionObserver } from "../custom hooks/usePositionObserver";
import SearchInput from "./SearchInput";
import MxIcon from "./MxIcon";
import { IOption } from "typings/option";
import {
    BadgeColorEnum,
    OptionsStyleSetEnum,
    OptionsStyleSingleEnum,
    ReferenceSetStyleEnum,
    SelectionTypeEnum,
    SelectStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import CurrentValueDisplay from "./CurrentValueDisplay";
import classNames from "classnames";

const FOCUS_DELAY = 300;

interface SelectorProps {
    id: string;
    name: string;
    tabIndex: number;
    ariaLabel: string | undefined;
    placeholder: string | undefined;
    noResultsText: string;
    options: IOption[];
    currentValue: IOption | IOption[] | undefined;
    onSelect: (selectedOption: IOption | IOption[] | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon: WebIcon | undefined;
    clearIconTitle: string;
    isSearchable: boolean;
    isReadOnly: boolean;
    selectionType: SelectionTypeEnum;
    selectStyle: SelectStyleEnum;
    showSelectAll: boolean; // selectionType = ReferenceSet
    selectAllIcon: WebIcon | undefined; // selectionType = ReferenceSet
    selectAllIconTitle: string; // selectionType = ReferenceSet
    dropdownIcon: WebIcon | undefined; // selectStyle = Dropdown
    maxMenuHeight: string | undefined; // selectStyle = Dropdown
    hasMoreOptions: boolean; // selectionType = Reference or ReferenceSet
    moreResultsText: string | undefined; // selectionType = Reference or ReferenceSet
    onSelectMoreOptions: (() => void) | undefined; // selectionType = Reference or ReferenceSet
    optionsStyle: OptionsStyleSetEnum | OptionsStyleSingleEnum;
    referenceSetStyle: ReferenceSetStyleEnum; // selectionType = ReferenceSet
    badgeColor: BadgeColorEnum; // selectionType = ReferenceSet && referenceSetStyle === badges
    isCompact: boolean; // selectionType = ReferenceSet
    maxReferenceDisplay: number; // selectionType = ReferenceSet
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined; // selectionType = ReferenceSet
    onExtraClick: (() => void) | undefined; // selectionType = ReferenceSet & maxReferenceDisplay > 0
    srsRef?: RefObject<HTMLDivElement>;
    onLeave: () => void;
    onEnter: () => void;
    isLoading: boolean;
    loadingText: string;
    allowLoadingSelect: boolean;
    clearSearchOnSelect: boolean;
    showMenu: boolean;
    setShowMenu: (newShowMenu: boolean) => void;
    ariaRequired: boolean;
    ariaSelectedText: string;
    autoFocus: boolean;
}

const Selector = (props: SelectorProps): ReactElement => {
    // const [hasFocus, setHasFocus] = useState(false);
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);

    const currentFocus = useMemo(() => props.options[focusedObjIndex], [props.options, focusedObjIndex]);
    const optionsLength = useMemo(() => props.options.length, [props.options]);

    const position = usePositionObserver(props.srsRef, props.selectStyle === "dropdown" && props.showMenu);

    const hasCurrentValue = useMemo(
        (): boolean =>
            props.selectionType !== "referenceSet"
                ? props.currentValue !== undefined
                : props.currentValue !== undefined &&
                  Array.isArray(props.currentValue) &&
                  props.currentValue.length > 0,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.currentValue]
    );

    useEffect(() => {
        if (props.autoFocus && focusedObjIndex === -1 && hasCurrentValue) {
            //set focus to the first selected option
            const index = props.options.findIndex(option => option.isSelected);
            setFocusedObjIndex(index);
        }
    }, [hasCurrentValue, focusedObjIndex, props.options, props.autoFocus]);

    const focusSearchInput = useCallback((): void => {
        if (searchInput !== null) {
            setTimeout(() => searchInput.focus(), FOCUS_DELAY);
        }
    }, [searchInput]);

    const onLeaveHandler = useCallback((): void => {
        if (props.showMenu) {
            props.setShowMenu(false);
            if (props.mxFilter !== "") {
                props.setMxFilter("");
            }
            if (focusedObjIndex !== -1) {
                setFocusedObjIndex(-1);
            }
            props.onLeave();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.showMenu, props.autoFocus, props.mxFilter, focusedObjIndex, props.onLeave, props.setMxFilter]);

    const onSelectHandler = useCallback(
        (selectedOption: IOption | undefined): void => {
            if (selectedOption) {
                if (Array.isArray(props.currentValue)) {
                    // reference set
                    if (hasCurrentValue) {
                        const selectedObjectItem = selectedOption.id as ObjectItem;
                        if (
                            props.currentValue.find(option => {
                                const iteratorObjectItem = option.id as ObjectItem;
                                return iteratorObjectItem.id === selectedObjectItem.id;
                            }) !== undefined
                        ) {
                            if (props.isClearable || props.currentValue.length > 1) {
                                // option already selected, deselect
                                props.onSelect(
                                    props.currentValue.filter(option => {
                                        const iteratorObjectItem = option.id as ObjectItem;
                                        return iteratorObjectItem.id !== selectedObjectItem.id;
                                    })
                                );
                            }
                        } else {
                            // list already exists, add to list
                            props.onSelect([...props.currentValue, selectedOption]);
                        }
                    } else {
                        // list is empty, start list
                        props.onSelect([selectedOption]);
                    }
                    // for reference sets, do not close the menu on select
                    if (props.clearSearchOnSelect) {
                        props.setMxFilter("");
                    }
                    return;
                } else {
                    // reference or enum
                    props.onSelect(selectedOption);
                }
            } else {
                // clear the selection
                props.onSelect(undefined);
            }
            if (props.selectionType !== "referenceSet") {
                props.setShowMenu(false);
            }
            onLeaveHandler();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            props.onSelect,
            props.currentValue,
            hasCurrentValue,
            props.clearSearchOnSelect,
            onLeaveHandler,
            props.setMxFilter
        ]
    );

    const handleClearAll = useCallback((): void => {
        if (focusedObjIndex !== -1) {
            setFocusedObjIndex(-1);
        }
        if (props.mxFilter !== "") {
            props.setMxFilter("");
        } else {
            onSelectHandler(undefined);
        }
        setTimeout(() => props.setShowMenu(true), FOCUS_DELAY);
        focusSearchInput();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusedObjIndex, props.mxFilter, onSelectHandler, focusSearchInput, props.setMxFilter]);

    const handleKeyNavigation = useCallback(
        (event: KeyboardEvent<HTMLDivElement>): void => {
            const keyPressed = event.key;
            if (keyPressed === "ArrowUp") {
                event.preventDefault();
                if (focusedObjIndex === -1) {
                    setFocusedObjIndex(0);
                } else if (focusedObjIndex > 0) {
                    setFocusedObjIndex(focusedObjIndex - 1);
                } else if (props.hasMoreOptions) {
                    setFocusedObjIndex(optionsLength);
                } else {
                    setFocusedObjIndex(optionsLength - 1);
                }
                if (!props.showMenu) {
                    props.setShowMenu(true);
                }
            } else if (keyPressed === "ArrowDown") {
                event.preventDefault();
                if (focusedObjIndex === -1) {
                    setFocusedObjIndex(0);
                } else if (
                    focusedObjIndex < optionsLength - 1 ||
                    (focusedObjIndex === optionsLength - 1 && props.hasMoreOptions)
                ) {
                    setFocusedObjIndex(focusedObjIndex + 1);
                } else {
                    setFocusedObjIndex(0);
                }
                if (!props.showMenu) {
                    props.setShowMenu(true);
                }
            } else if (keyPressed === "Enter") {
                if (focusedObjIndex > -1 && (props.allowLoadingSelect || !props.isLoading)) {
                    if (focusedObjIndex === optionsLength && props.onSelectMoreOptions) {
                        props.onSelectMoreOptions();
                    } else {
                        if (currentFocus.isSelectable) {
                            onSelectHandler(currentFocus);
                        }
                    }
                }
            } else if (keyPressed === "Escape" || keyPressed === "Tab") {
                onLeaveHandler();
            } else if (keyPressed === " " && !props.showMenu) {
                event.preventDefault();
                if (!props.showMenu) {
                    props.setShowMenu(true);
                }
                setFocusedObjIndex(0);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            focusedObjIndex,
            optionsLength,
            onSelectHandler,
            props.onSelectMoreOptions,
            onLeaveHandler,
            props.hasMoreOptions,
            props.isLoading,
            props.showMenu
        ]
    );

    useOnClickOutside(props.srsRef, onLeaveHandler);

    const optionClickHandler = useCallback(
        (selectedOption: IOption | undefined): void => {
            setFocusedObjIndex(-1);
            onSelectHandler(selectedOption);
            focusSearchInput(); // re-focus the input so the user can tab away
        },
        [onSelectHandler, focusSearchInput]
    );

    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            const value = event.target.value;
            props.setMxFilter(value);
            setFocusedObjIndex(0);
            // make sure the dropdown is open if the user is typing
            if (value.trim() !== "" && !props.showMenu) {
                props.setShowMenu(true);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.showMenu, props.setMxFilter]
    );
    const currentValueAriaText = useMemo(
        () =>
            props.currentValue
                ? `, ${props.ariaSelectedText}: ${
                      Array.isArray(props.currentValue)
                          ? props.currentValue.map(value => value.ariaLiveText).join("; ")
                          : props.currentValue.ariaLiveText
                  }, search: `
                : "search: ",
        [props.currentValue, props.ariaSelectedText]
    );

    return (
        <Fragment>
            <div
                className={classNames("form-control", { active: props.showMenu }, { "read-only": props.isReadOnly })}
                onClick={() => {
                    if (!props.isReadOnly) {
                        props.setShowMenu(!props.showMenu);
                        if (props.showMenu === false) {
                            focusSearchInput();
                        }
                    }
                }}
                onKeyDown={event => {
                    if (!props.isReadOnly) {
                        handleKeyNavigation(event);
                    }
                }}
                ref={props.srsRef}
                // onFocus={() => setHasFocus(true)}
            >
                <div className="srs-select">
                    <div
                        className={classNames(
                            "srs-value-container",
                            { "srs-multi": props.selectionType === "referenceSet" },
                            {
                                "srs-compact":
                                    props.isCompact && props.selectionType === "referenceSet" && hasCurrentValue
                            },
                            {
                                "srs-badges":
                                    props.selectionType === "referenceSet" && props.referenceSetStyle === "badges"
                            },
                            {
                                "srs-commas":
                                    props.selectionType === "referenceSet" && props.referenceSetStyle === "commas"
                            }
                        )}
                    >
                        {/* CurrentValueDisplay should be hidden if the user is typing and always be shown for reference sets */}
                        {(props.selectionType === "referenceSet" || props.mxFilter === "") && (
                            <CurrentValueDisplay
                                {...props}
                                onRemove={(clickObj, byKeyboard) => {
                                    onSelectHandler(clickObj);
                                    if (byKeyboard && hasCurrentValue && (props.currentValue as []).length > 1) {
                                        // focus the next remove icon for easier clear by keyboard navigation
                                        const nextIcons =
                                            props.srsRef?.current?.getElementsByClassName("srs-focusable");

                                        if (nextIcons && nextIcons.length > 0) {
                                            (nextIcons[0] as HTMLButtonElement).focus();
                                        } else {
                                            focusSearchInput();
                                        }
                                    } else {
                                        // re-focus the search input for easier muli-select

                                        focusSearchInput();
                                    }
                                }}
                            />
                        )}

                        <SearchInput
                            {...props}
                            onChange={handleInputChange}
                            setRef={newRef => setSearchInput(newRef)}
                            hasCurrentValue={hasCurrentValue}
                            searchFilter={props.mxFilter}
                            showMenu={props.showMenu || props.selectStyle === "list"}
                            isReferenceSet={props.selectionType === "referenceSet"}
                            onFocus={props.onEnter}
                            currentFocus={focusedObjIndex}
                            currentValueAriaText={currentValueAriaText}
                            focusedObjIndex={focusedObjIndex}
                            noResultsFound={!props.isLoading && optionsLength === 0}
                        />
                    </div>
                    {!props.isReadOnly && (
                        <div
                            className="srs-icon-row"
                            style={{ gridRow: props.selectionType === "referenceSet" ? 2 : 1 }}
                        >
                            {props.selectionType === "referenceSet" && props.showSelectAll && (
                                <MxIcon
                                    tabIndex={props.tabIndex || 0}
                                    onClick={() => {
                                        props.setMxFilter("");
                                        setFocusedObjIndex(-1);
                                        props.onSelect(props.options.filter(option => option.isSelectable));
                                    }}
                                    title={props.selectAllIconTitle}
                                    mxIconOverride={props.selectAllIcon}
                                    defaultClassName="check"
                                />
                            )}

                            {props.isClearable && (
                                <MxIcon
                                    tabIndex={props.tabIndex || 0}
                                    onClick={handleClearAll}
                                    title={props.clearIconTitle}
                                    mxIconOverride={props.clearIcon}
                                    defaultClassName="remove"
                                />
                            )}
                            {props.selectStyle === "dropdown" && (
                                <MxIcon mxIconOverride={props.dropdownIcon} defaultClassName="menu-down" />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {(props.showMenu || props.selectStyle === "list") && !props.isReadOnly && (
                <OptionsMenu
                    {...props}
                    multiSelect={props.selectionType === "referenceSet"}
                    onSelect={optionClickHandler}
                    focusedObjIndex={focusedObjIndex}
                    setFocusedObjIndex={setFocusedObjIndex}
                    position={position}
                    onSelectMoreOptions={() => {
                        if (props.onSelectMoreOptions) {
                            props.onSelectMoreOptions();
                            if (props.selectStyle === "dropdown") {
                                focusSearchInput();
                            }
                        }
                    }}
                />
            )}
        </Fragment>
    );
};

export default Selector;
