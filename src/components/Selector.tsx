import {
    createElement,
    useState,
    ReactElement,
    ChangeEvent,
    Fragment,
    RefObject,
    MouseEvent,
    KeyboardEvent,
    useEffect
} from "react";
import { WebIcon } from "mendix";
import OptionsMenu from "./OptionMenu";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import { usePositionObserver } from "../custom hooks/usePositionObserver";
import SearchInput from "./SearchInput";
import MxIcon from "./MxIcon";
import { IOption } from "typings/option";
import {
    OptionsStyleSetEnum,
    OptionsStyleSingleEnum,
    ReferenceSetStyleEnum,
    SelectionTypeEnum,
    SelectStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import CurrentValueDisplay from "./CurrentValueDisplay";

const onLeaveHandler = (
    showMenu: boolean,
    setShowMenu: (newShowMenu: boolean) => void,
    searchFilter: string,
    setSearchFilter: (newSearchFilter: string) => void,
    focusedObjIndex: number,
    setFocusedObjIndex: (newIndex: number) => void,
    onLeave: () => void
): void => {
    if (showMenu) {
        setShowMenu(false);
        if (searchFilter.trim() !== "") {
            setSearchFilter("");
        }
        if (focusedObjIndex !== -1) {
            setFocusedObjIndex(-1);
        }
        onLeave();
    }
};

const handleClearAll = (
    event: MouseEvent<HTMLDivElement | HTMLSpanElement>,
    searchFilter: string,
    setSearchFilter: (newFilter: string) => void,
    focusedObjIndex: number,
    setFocusedObjIndex: (newIndex: number) => void,
    onSelectHandler: (selectedOption: IOption | undefined) => void,
    searchInput: HTMLInputElement | null,
    // showMenu: boolean,
    setShowMenu: (newShowMenu: boolean) => void
): void => {
    event.stopPropagation();
    if (focusedObjIndex !== -1) {
        setFocusedObjIndex(-1);
    }
    if (searchFilter.trim() !== "") {
        setSearchFilter("");
    } else {
        onSelectHandler(undefined);
    }
    setTimeout(() => setShowMenu(true), 100);
    focusSearchInput(searchInput, 300);
};

const focusSearchInput = (input: HTMLInputElement | null, delay: number): void => {
    if (input !== null) {
        if (delay !== undefined) {
            setTimeout(() => input?.focus(), delay);
        } else {
            input.focus();
        }
    }
};

const handleKeyNavigation = (
    event: KeyboardEvent<HTMLDivElement>,
    focusedObjIndex: number,
    setFocusedObjIndex: (newIndex: number) => void,
    options: IOption[],
    onSelect: (selectedObj: IOption) => void,
    closeOnSelect: boolean,
    setShowMenu: (newShowMenu: boolean) => void,
    onLeave: () => void,
    allowLoadingSelect: boolean,
    isLoading: boolean
): void => {
    const keyPressed = event.key;
    if (keyPressed === "ArrowUp" || keyPressed === "ArrowLeft") {
        if (focusedObjIndex === -1) {
            setFocusedObjIndex(0);
        } else if (focusedObjIndex > 0) {
            setFocusedObjIndex(focusedObjIndex - 1);
        } else {
            setFocusedObjIndex(options.length - 1);
        }
        setShowMenu(true);
    } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
        if (focusedObjIndex === -1) {
            setFocusedObjIndex(0);
        } else if (focusedObjIndex < options.length - 1) {
            setFocusedObjIndex(focusedObjIndex + 1);
        } else {
            setFocusedObjIndex(0);
        }
        setShowMenu(true);
    } else if (keyPressed === "Enter") {
        if (focusedObjIndex > -1 && (allowLoadingSelect || !isLoading)) {
            const currentFocusedOption = options[focusedObjIndex];
            if (currentFocusedOption.isSelectable) {
                onSelect(currentFocusedOption);
            }
            if (closeOnSelect) {
                onLeave();
            }
        }
    } else if (keyPressed === "Escape" || keyPressed === "Tab") {
        onLeave();
    }
};

interface SelectorProps {
    name: string;
    tabIndex?: number;
    placeholder: string | undefined;
    noResultsText: string;
    options: IOption[];
    currentValue: IOption | IOption[] | undefined;
    onSelect: (selectedOption: IOption | IOption[] | undefined) => void;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon: WebIcon | undefined;
    isSearchable: boolean;
    isReadOnly: boolean;
    selectionType: SelectionTypeEnum;
    selectStyle: SelectStyleEnum;
    showSelectAll: boolean; // selectionType = ReferenceSet
    selectAllIcon: WebIcon | undefined; // selectionType = ReferenceSet
    dropdownIcon: WebIcon | undefined; // selectStyle = Dropdown
    maxMenuHeight: string; // selectStyle = Dropdown
    hasMoreOptions: boolean; // selectionType = Reference or ReferenceSet
    moreResultsText: string | undefined; // selectionType = Reference or ReferenceSet
    onSelectMoreOptions: (() => void) | undefined; // selectionType = Reference or ReferenceSet
    optionsStyle: OptionsStyleSetEnum | OptionsStyleSingleEnum;
    referenceSetStyle: ReferenceSetStyleEnum; // selectionType = ReferenceSet
    maxReferenceDisplay: number; // selectionType = ReferenceSet
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined; // selectionType = ReferenceSet
    srsRef?: RefObject<HTMLDivElement>;
    onLeave: () => void;
    isLoading: boolean;
    loadingText: string;
    allowLoadingSelect: boolean;
}

const Selector = ({
    clearIcon,
    currentValue,
    dropdownIcon,
    hasMoreOptions,
    isClearable,
    isReadOnly,
    isSearchable,
    maxMenuHeight,
    maxReferenceDisplay,
    moreResultsText,
    name,
    noResultsText,
    onBadgeClick,
    onSelect,
    onSelectMoreOptions,
    options,
    optionsStyle,
    placeholder,
    referenceSetStyle,
    // searchFilter,
    selectAllIcon,
    setMxFilter,
    showSelectAll,
    tabIndex,
    selectStyle,
    selectionType,
    srsRef,
    onLeave,
    isLoading,
    loadingText,
    allowLoadingSelect
}: SelectorProps): ReactElement => {
    const [showMenu, setShowMenu] = useState(false);
    const [searchFilter, setSearchFilter] = useState("");
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);

    useEffect(() => {
        setMxFilter(searchFilter);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchFilter]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const position = srsRef && usePositionObserver(srsRef.current, selectStyle === "dropdown" && showMenu);

    const hasCurrentValue =
        selectionType !== "referenceSet"
            ? currentValue !== undefined
            : currentValue !== undefined && Array.isArray(currentValue) && currentValue.length > 0;

    if (srsRef) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useOnClickOutside(srsRef, () => {
            onLeaveHandler(
                showMenu,
                setShowMenu,
                searchFilter,
                setSearchFilter,
                focusedObjIndex,
                setFocusedObjIndex,
                onLeave
            );
        });
    }

    const onSelectHandler = (selectedOption: IOption | undefined): void => {
        if (selectedOption) {
            if (Array.isArray(currentValue)) {
                // reference set
                if (hasCurrentValue) {
                    if (currentValue.find(option => option.id === selectedOption.id)) {
                        if (isClearable || currentValue.length > 1) {
                            // option already selected, deselect
                            onSelect(currentValue.filter(option => option.id !== selectedOption.id));
                        }
                    } else {
                        // list already exists, add to list
                        onSelect([...currentValue, selectedOption]);
                    }
                } else {
                    // list is empty, start list
                    onSelect([selectedOption]);
                }
                // for reference sets, do not close the menu on select
                if (searchFilter.trim() !== "") {
                    setSearchFilter("");
                }
                return;
            } else {
                // reference or enum
                onSelect(selectedOption);
            }
        } else {
            // clear the selection
            onSelect(undefined);
        }
        if (selectionType !== "referenceSet") {
            setShowMenu(false);
        }
        onLeaveHandler(
            showMenu,
            setShowMenu,
            searchFilter,
            setSearchFilter,
            focusedObjIndex,
            setFocusedObjIndex,
            onLeave
        );
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setSearchFilter(value);
        setFocusedObjIndex(0);
        // make sure the dropdown is open if the user is typing
        if (value.trim() !== "" && !showMenu) {
            setShowMenu(true);
        }
    };

    return (
        <Fragment>
            <div
                className={`form-control ${showMenu ? "active" : ""} ${isReadOnly ? "read-only" : ""}`}
                onClick={() => {
                    if (!isReadOnly) {
                        setShowMenu(!showMenu);
                        if (showMenu === false) {
                            focusSearchInput(searchInput, 300);
                        }
                    }
                }}
                onKeyDown={event => {
                    if (!isReadOnly) {
                        handleKeyNavigation(
                            event,
                            focusedObjIndex,
                            setFocusedObjIndex,
                            options,
                            onSelectHandler,
                            selectionType !== "referenceSet",
                            setShowMenu,
                            // () => updatePositionManually(selectStyle, setPosition, srsRef),
                            () =>
                                onLeaveHandler(
                                    showMenu,
                                    setShowMenu,
                                    searchFilter,
                                    setSearchFilter,
                                    focusedObjIndex,
                                    setFocusedObjIndex,
                                    onLeave
                                ),
                            allowLoadingSelect,
                            isLoading
                        );
                    }
                }}
                ref={srsRef}
            >
                <div className="srs-search-input">
                    {/* Hide Search Input if read only and there is already a value */}
                    {!(isReadOnly && hasCurrentValue) && (
                        <SearchInput
                            isReadOnly={isReadOnly}
                            isSearchable={isSearchable}
                            name={name}
                            onChange={handleInputChange}
                            placeholder={placeholder}
                            setRef={newRef => setSearchInput(newRef)}
                            hasCurrentValue={hasCurrentValue}
                            searchFilter={searchFilter}
                            showMenu={showMenu}
                            isReferenceSet={selectionType === "referenceSet"}
                            tabIndex={tabIndex}
                        />
                    )}

                    {/* CurrentValueDisplay should be hidden if the user is typing and always be shown for reference sets */}
                    {(selectionType === "referenceSet" || searchFilter === "") && (
                        <CurrentValueDisplay
                            currentValue={currentValue}
                            isClearable={isClearable}
                            isReadOnly={isReadOnly}
                            maxReferenceDisplay={maxReferenceDisplay}
                            onRemove={clickObj => onSelectHandler(clickObj)}
                            referenceSetStyle={referenceSetStyle}
                            clearIcon={clearIcon}
                            onBadgeClick={onBadgeClick}
                        />
                    )}
                    {!isReadOnly && (
                        <div className="srs-icon-row" style={{ gridRow: selectionType === "referenceSet" ? 2 : 1 }}>
                            {selectionType === "referenceSet" && showSelectAll && (
                                <MxIcon
                                    onClick={event => {
                                        event.stopPropagation();
                                        setSearchFilter("");
                                        setFocusedObjIndex(-1);
                                        onSelect(options.filter(option => option.isSelectable));
                                    }}
                                    title={"Select All"}
                                    mxIconOverride={selectAllIcon}
                                    defaultClassName="check"
                                />
                            )}

                            {isClearable && (
                                <MxIcon
                                    onClick={event => {
                                        // updatePositionManually(selectStyle, setPosition, srsRef);
                                        handleClearAll(
                                            event,
                                            searchFilter,
                                            setSearchFilter,
                                            focusedObjIndex,
                                            setFocusedObjIndex,
                                            onSelectHandler,
                                            searchInput,
                                            // showMenu,
                                            setShowMenu
                                        );
                                    }}
                                    title={"Clear"}
                                    mxIconOverride={clearIcon}
                                    defaultClassName="remove"
                                />
                            )}
                            {selectStyle === "dropdown" && (
                                <MxIcon mxIconOverride={dropdownIcon} defaultClassName="menu-down" />
                            )}
                        </div>
                    )}
                </div>
            </div>
            {(showMenu || selectStyle === "list") && !isReadOnly && (
                <OptionsMenu
                    onSelect={onSelectHandler}
                    currentFocus={options[focusedObjIndex]}
                    maxMenuHeight={maxMenuHeight}
                    noResultsText={noResultsText}
                    moreResultsText={moreResultsText}
                    optionsStyle={optionsStyle}
                    selectStyle={selectStyle}
                    position={position}
                    onSelectMoreOptions={() => {
                        if (onSelectMoreOptions) {
                            onSelectMoreOptions();
                            if (selectStyle === "dropdown") {
                                focusSearchInput(searchInput, 300);
                            }
                        }
                    }}
                    options={options}
                    hasMoreOptions={hasMoreOptions}
                    isLoading={isLoading}
                    loadingText={loadingText}
                    allowLoadingSelect={allowLoadingSelect}
                />
            )}
        </Fragment>
    );
};

export default Selector;
