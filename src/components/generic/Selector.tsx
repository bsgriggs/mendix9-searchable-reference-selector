import { createElement, useState, ReactElement, ChangeEvent, Fragment, RefObject } from "react";
import { WebIcon, ListActionValue } from "mendix";
import OptionsMenu from "./OptionMenu";
import useOnClickOutside from "../../custom hooks/useOnClickOutside";
import usePositionUpdate, { mapPosition, Position } from "../../custom hooks/usePositionUpdate";
import focusSearchInput from "../../utils/focusSearchInput";
import handleKeyNavigation from "./handleKeyNavigation";
import handleClearAll from "./handleClearAll";
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

interface SelectorProps {
    name: string;
    tabIndex: number | undefined;
    placeholder: string | undefined;
    noResultsText: string;
    options: IOption[];
    currentValue: IOption | IOption[] | undefined;
    onSelect: (selectedOption: IOption | IOption[] | undefined) => void;
    searchFilter: string;
    setSearchFilter: (newFilter: string) => void;
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
    onBadgeClick: ListActionValue | undefined; // selectionType = ReferenceSet
    srsRef: RefObject<HTMLDivElement>;
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
    searchFilter,
    selectAllIcon,
    setSearchFilter,
    showSelectAll,
    tabIndex,
    selectStyle,
    selectionType,
    srsRef
}: SelectorProps): ReactElement => {
    const [showMenu, setShowMenu] = useState(false);
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0, w: 0, h: 0 });

    if (selectStyle === "dropdown") {
        usePositionUpdate(srsRef, newPosition => {
            setPosition(newPosition);
        });
    }

    useOnClickOutside(srsRef, () => {
        // handle click outside
        if (showMenu) {
            setShowMenu(false);
            setFocusedObjIndex(-1);
            setSearchFilter("");
        }
    });

    const onSelectHandler = (selectedOption: IOption | undefined): void => {
        if (selectedOption) {
            if (Array.isArray(currentValue)) {
                //reference set
                if (currentValue !== undefined && currentValue.length > 0) {
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
        setSearchFilter("");
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
                tabIndex={!isReadOnly ? tabIndex || 0 : undefined}
                onClick={() => {
                    if (!isReadOnly) {
                        setShowMenu(!showMenu);
                        if (selectStyle === "dropdown") {
                            setPosition(mapPosition(srsRef.current));
                        }
                        if (showMenu === false) {
                            focusSearchInput(searchInput, 300);
                        }
                    }
                }}
                onKeyDown={event =>
                    handleKeyNavigation(
                        event,
                        focusedObjIndex,
                        setFocusedObjIndex,
                        options,
                        onSelectHandler,
                        selectionType !== "referenceSet",
                        isReadOnly,
                        setShowMenu,
                        () => {
                            if (selectStyle === "dropdown") {
                                setPosition(mapPosition(srsRef.current));
                            }
                        }
                    )
                }
                ref={srsRef}
            >
                <div className="srs-search-input">
                    <SearchInput
                        isReadOnly={isReadOnly}
                        isSearchable={isSearchable}
                        name={name}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        setRef={newRef => setSearchInput(newRef)}
                        hasCurrentValue={currentValue !== undefined}
                        searchFilter={searchFilter}
                        showMenu={showMenu}
                        isReferenceSet={selectionType === "referenceSet"}
                    />
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
                                if (selectStyle === "dropdown") {
                                    setPosition(mapPosition(srsRef.current));
                                }
                                handleClearAll(
                                    event,
                                    searchFilter,
                                    setSearchFilter,
                                    setFocusedObjIndex,
                                    () => {
                                        onSelectHandler(undefined);
                                    },
                                    searchInput,
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
            {(showMenu || selectStyle === "list") && !isReadOnly &&(
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
                            focusSearchInput(searchInput, 300);
                        }
                    }}
                    options={options}
                    hasMoreOptions={hasMoreOptions}
                />
            )}
        </Fragment>
    );
};

export default Selector;
