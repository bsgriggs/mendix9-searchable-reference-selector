import {
    createElement,
    useState,
    // useEffect,
    ReactElement,
    ChangeEvent,
    Fragment,
    KeyboardEvent,
    useCallback,
    useMemo,
    RefObject
} from "react";
import { ObjectItem } from "mendix";
import OptionsMenu from "./OptionMenu";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import { usePositionObserver } from "../custom hooks/usePositionObserver";
import SearchInput from "./SearchInput";
import MxIcon from "./MxIcon";
import { IOption } from "../../typings/option";
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
import { IMxIcon } from "../../typings/general";

const FOCUS_DELAY = 100;

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
    clearIcon: IMxIcon;
    clearIconTitle: string;
    isSearchable: boolean;
    isReadOnly: boolean;
    selectionType: SelectionTypeEnum;
    selectStyle: SelectStyleEnum;
    showSelectAll: boolean; // selectionType = ReferenceSet
    selectAllIcon: IMxIcon; // selectionType = ReferenceSet
    selectAllIconTitle: string; // selectionType = ReferenceSet
    dropdownIcon: IMxIcon; // selectStyle = Dropdown
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
    ariaSelectedText: string | undefined;
    autoFocusIndex: number;
    ariaArrowKeyInstructions: string | undefined;
    ariaSearchText: string | undefined;
    extraAriaLabel: string | undefined;
}

const Selector = (props: SelectorProps): ReactElement => {
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const [focusedBadgeIndex, setFocusedBadgeIndex] = useState(-1);
    const [focusedBadgeRemove, setFocusedBadgeRemove] = useState(true);
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

    const focusSearchInput = useCallback(
        (delay: boolean): void => {
            if (searchInput !== null) {
                if (delay) {
                    setTimeout(() => searchInput.focus(), FOCUS_DELAY);
                } else {
                    searchInput.focus();
                }
            }
        },
        [searchInput]
    );

    const onLeaveHandler = useCallback((): void => {
        if (props.showMenu) {
            props.setShowMenu(false);
            setFocusedBadgeIndex(-1);
            if (props.mxFilter !== "") {
                props.setMxFilter("");
            }
            if (focusedObjIndex !== -1) {
                setFocusedObjIndex(-1);
            }
            props.onLeave();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.showMenu, props.mxFilter, focusedObjIndex, props.onLeave, props.setMxFilter]);

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
        focusSearchInput(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focusedObjIndex, props.mxFilter, onSelectHandler, focusSearchInput, props.setMxFilter]);

    const focusBadge = useCallback(
        (id: string) => {
            const focusElement = props.srsRef?.current?.querySelector(`#${id}`);
            if (focusElement) {
                (focusElement as HTMLButtonElement).focus();
            }
        },
        [props.srsRef]
    );

    const handleKeyNavigation = (event: KeyboardEvent<HTMLDivElement>): void => {
        const keyPressed = event.key;
        if (keyPressed === "ArrowUp") {
            event.preventDefault();

            if (focusedObjIndex === -1) {
                setFocusedObjIndex(props.autoFocusIndex !== -1 ? props.autoFocusIndex : 0);
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
            if (focusedBadgeIndex !== -1) {
                setFocusedBadgeIndex(-1);
                focusSearchInput(false);
            }
        } else if (keyPressed === "ArrowDown") {
            event.preventDefault();
            if (focusedObjIndex === -1) {
                setFocusedObjIndex(props.autoFocusIndex !== -1 ? props.autoFocusIndex : 0);
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
            if (focusedBadgeIndex !== -1) {
                setFocusedBadgeIndex(-1);
                focusSearchInput(false);
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
        } else if (keyPressed === "Escape") {
            onLeaveHandler();
        } else if (keyPressed === "Tab") {
            setFocusedBadgeIndex(-1);
            onLeaveHandler();
        } else if (keyPressed === " " && !props.showMenu) {
            event.preventDefault();
            if (!props.showMenu) {
                props.setShowMenu(true);
            }
            setFocusedObjIndex(props.autoFocusIndex !== -1 ? props.autoFocusIndex : 0);
        } else if (
            props.selectionType === "referenceSet" &&
            Array.isArray(props.currentValue) &&
            hasCurrentValue &&
            props.mxFilter.trim() === ""
        ) {
            const valuesShown =
                props.currentValue.length > props.maxReferenceDisplay && props.maxReferenceDisplay > 0
                    ? props.maxReferenceDisplay
                    : props.currentValue.length;
            const badgeBodyFocusable = props.onBadgeClick;
            const removeIconsShowing = props.isClearable && props.referenceSetStyle === "badges";
            const extraFocusable = props.currentValue.length > valuesShown && props.onExtraClick;
            if (keyPressed === "ArrowLeft") {
                event.preventDefault();
                if (focusedBadgeIndex === -1) {
                    if (extraFocusable) {
                        // There is an Extra click
                        focusBadge("extra");
                        setFocusedBadgeIndex(valuesShown);
                        setFocusedBadgeRemove(false);
                    } else if (removeIconsShowing) {
                        // Focus last badge's remove button
                        focusBadge(`badge-remove-${valuesShown - 1}`);
                        setFocusedBadgeIndex(valuesShown - 1);
                        setFocusedBadgeRemove(true);
                    } else if (badgeBodyFocusable) {
                        // focus last badge's content area
                        focusBadge(`badge-content-${valuesShown - 1}`);
                        setFocusedBadgeIndex(valuesShown - 1);
                        setFocusedBadgeRemove(false);
                    }
                } else {
                    if (badgeBodyFocusable && focusedBadgeRemove) {
                        // Move from remove icon to badge content
                        focusBadge(`badge-content-${focusedBadgeIndex}`);
                        setFocusedBadgeRemove(false);
                    } else if (badgeBodyFocusable && !removeIconsShowing && focusedBadgeIndex !== 0) {
                        // No remove icons, only badge content
                        focusBadge(`badge-content-${focusedBadgeIndex - 1}`);
                        setFocusedBadgeIndex(focusedBadgeIndex - 1);
                        setFocusedBadgeRemove(false);
                    } else if (removeIconsShowing && focusedBadgeIndex !== 0) {
                        // Move to next remove icon
                        focusBadge(`badge-remove-${focusedBadgeIndex - 1}`);
                        setFocusedBadgeIndex(focusedBadgeIndex - 1);
                        setFocusedBadgeRemove(true);
                    } else if (focusedBadgeIndex === 0) {
                        // Wrap around
                        focusSearchInput(false);
                        setFocusedBadgeIndex(-1);
                    }
                }
            } else if (keyPressed === "ArrowRight") {
                event.preventDefault();
                if (focusedBadgeIndex !== -1) {
                    // Badges are focused
                    if (
                        focusedBadgeIndex === valuesShown ||
                        (!extraFocusable &&
                            focusedBadgeIndex === valuesShown - 1 &&
                            (focusedBadgeRemove || !removeIconsShowing))
                    ) {
                        // Last badge or extra is focused
                        focusSearchInput(false);
                        setFocusedBadgeIndex(-1);
                    } else if (!focusedBadgeRemove && removeIconsShowing) {
                        // Move from badge content to remove icon
                        focusBadge(`badge-remove-${focusedBadgeIndex}`);
                        setFocusedBadgeRemove(true);
                    } else if (badgeBodyFocusable && focusedBadgeRemove && focusedBadgeIndex !== valuesShown - 1) {
                        // Move from remove icon to badge content
                        focusBadge(`badge-content-${focusedBadgeIndex + 1}`);
                        setFocusedBadgeIndex(focusedBadgeIndex + 1);
                        setFocusedBadgeRemove(false);
                    } else if (!removeIconsShowing && focusedBadgeIndex !== valuesShown - 1) {
                        // No remove icon, move between badge content
                        focusBadge(`badge-content-${focusedBadgeIndex + 1}`);
                        setFocusedBadgeIndex(focusedBadgeIndex + 1);
                        setFocusedBadgeRemove(false);
                    } else if (removeIconsShowing && focusedBadgeIndex !== valuesShown - 1) {
                        // Move to next remove icon
                        focusBadge(`badge-remove-${focusedBadgeIndex + 1}`);
                        setFocusedBadgeIndex(focusedBadgeIndex + 1);
                        setFocusedBadgeRemove(true);
                    } else if (focusedBadgeIndex === valuesShown - 1) {
                        // focus extra
                        if (extraFocusable) {
                            focusBadge("extra");
                            setFocusedBadgeIndex(valuesShown);
                        } else {
                            // Last badge or extra is focused
                            focusSearchInput(false);
                            setFocusedBadgeIndex(-1);
                        }
                    }
                } else {
                    // Focused on input, wrap around
                    if (props.onBadgeClick) {
                        focusBadge("badge-content-0");
                        setFocusedBadgeIndex(0);
                        setFocusedBadgeRemove(false);
                    } else if (removeIconsShowing) {
                        focusBadge("badge-remove-0");
                        setFocusedBadgeIndex(0);
                        setFocusedBadgeRemove(true);
                    }
                }
            }
        }
    };

    useOnClickOutside(props.srsRef, onLeaveHandler);

    const optionClickHandler = useCallback(
        (selectedOption: IOption | undefined): void => {
            setFocusedObjIndex(-1);
            onSelectHandler(selectedOption);
            focusSearchInput(true); // re-focus the input so the user can tab away
        },
        [onSelectHandler, focusSearchInput]
    );

    const handleInputChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>): void => {
            const value = event.target.value;
            props.setMxFilter(value);
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
                          ? props.currentValue.map(value => value.ariaLiveText).join("; ") +
                            `${
                                (props.isClearable || props.onBadgeClick) &&
                                hasCurrentValue &&
                                props.ariaArrowKeyInstructions &&
                                !props.isReadOnly
                                    ? `, ${props.ariaArrowKeyInstructions}`
                                    : ""
                            }`
                          : props.currentValue.ariaLiveText
                  }${props.isSearchable ? `, ${props.ariaSearchText}:` : ""} `
                : "",
        [
            props.currentValue,
            props.ariaSelectedText,
            props.ariaArrowKeyInstructions,
            hasCurrentValue,
            props.onBadgeClick,
            props.ariaSearchText,
            props.isClearable,
            props.isReadOnly,
            props.isSearchable
        ]
    );

    return (
        <Fragment>
            <div
                className={classNames("form-control", { active: props.showMenu }, { "read-only": props.isReadOnly })}
                onClick={() => {
                    if (!props.isReadOnly) {
                        props.setShowMenu(!props.showMenu);
                        if (props.showMenu === false) {
                            focusSearchInput(true);
                        }
                    }
                }}
                onKeyDown={event => {
                    if (!props.isReadOnly) {
                        handleKeyNavigation(event);
                    }
                }}
                ref={props.srsRef}
            >
                <div className="srs-select">
                    <div
                        role="application"
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
                                        focusBadge(`badge-remove-${focusedBadgeIndex - 1}`);
                                        setFocusedBadgeIndex(focusedBadgeIndex - 1);
                                    } else {
                                        // re-focus the search input for easier muli-select
                                        focusSearchInput(true);
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
                                    mxIcon={props.selectAllIcon}
                                />
                            )}

                            {props.isClearable && (
                                <MxIcon
                                    tabIndex={props.tabIndex || 0}
                                    onClick={handleClearAll}
                                    title={props.clearIconTitle}
                                    mxIcon={props.clearIcon}
                                />
                            )}
                            {props.selectStyle === "dropdown" && <MxIcon mxIcon={props.dropdownIcon} />}
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
                                focusSearchInput(true);
                            }
                        }
                    }}
                />
            )}
        </Fragment>
    );
};

export default Selector;
