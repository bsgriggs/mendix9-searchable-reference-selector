import React, { createElement, useState, useRef, ReactElement } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon, ListActionValue } from "mendix";
import DropdownIcon from "./icons/DropdownIcon";
import OptionsMenu from "./OptionsMenu";
import {
    OptionsStyleEnum,
    OptionTextTypeEnum,
    ReferenceSetStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import usePositionUpdate, { mapPosition, Position } from "../custom hooks/usePositionUpdate";
import SelectAllIcon from "./icons/SelectAllIcon";
import ClearIcon from "./icons/ClearIcon";
import focusSearchInput from "../utils/focusSearchInput";
import handleKeyNavigation from "src/utils/handleKeyNavigation";
import handleClear from "src/utils/handleClear";
import handleSelectAll from "src/utils/handleSelectAll";
import handleRemoveObj from "src/utils/handleSelectSet";
import SearchInput from "./SearchInput";
import CurrentValueSet from "./CurrentValueSet";

interface ReferenceSetDropdownProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    selectableObjects: ObjectItem[] | undefined;
    currentValues: ObjectItem[] | undefined;
    displayAttribute: ListAttributeValue<string>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectAssociation: (newObject: ObjectItem[] | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon?: DynamicValue<WebIcon>;
    isSearchable: boolean;
    isReadOnly: boolean;
    showSelectAll: boolean;
    selectAllIcon?: DynamicValue<WebIcon>;
    dropdownIcon?: DynamicValue<WebIcon>;
    maxHeight?: string;
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number;
    onBadgeClick?: ListActionValue;
    // isLoading: boolean;
}

const ReferenceSetDropdown = ({
    // isLoading,
    currentValues,
    isClearable,
    isReadOnly,
    isSearchable,
    maxReferenceDisplay,
    mxFilter,
    name,
    onSelectAssociation,
    optionTextType,
    optionsStyle,
    referenceSetStyle,
    selectableObjects,
    setMxFilter,
    showSelectAll,
    clearIcon,
    displayAttribute,
    dropdownIcon,
    maxHeight,
    moreResultsText,
    noResultsText,
    onBadgeClick,
    optionCustomContent,
    placeholder,
    selectAllIcon,
    selectableAttribute,
    tabIndex
}: ReferenceSetDropdownProps): ReactElement => {
    const [showMenu, setShowMenu] = useState(false);
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);
    const srsRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0, w: 0, h: 0 });

    usePositionUpdate(srsRef, newPosition => {
        setPosition(newPosition);
    });

    useOnClickOutside(srsRef, () => {
        // handle click outside
        setShowMenu(false);
        setFocusedObjIndex(-1);
    });

    const onSelectHandler = (selectedObj: ObjectItem | undefined): void => {
        if (selectedObj !== undefined) {
            if (currentValues !== undefined && currentValues.length > 0) {
                if (currentValues.find(obj => obj.id === selectedObj.id)) {
                    if (isClearable || currentValues.length > 1) {
                        // obj already selected , deselect
                        handleRemoveObj(selectedObj, setMxFilter, onSelectAssociation, currentValues);
                    }
                } else {
                    // list already exists, add to list
                    onSelectAssociation([...currentValues, selectedObj]);
                }
            } else {
                // list is empty, start list
                onSelectAssociation([selectedObj]);
            }
        } else {
            // clear all
            onSelectAssociation(selectedObj);
        }
        setMxFilter("");
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setMxFilter(value);
        setFocusedObjIndex(0);
        // make sure the dropdown is open if the user is typing
        if (value.trim() !== "" && showMenu === false) {
            setShowMenu(true);
        }
    };

    return (
        <div
            className={`form-control ${showMenu ? "active" : ""} ${isReadOnly ? "read-only" : ""}`}
            tabIndex={!isReadOnly ? tabIndex || 0 : undefined}
            onClick={() => {
                if (!isReadOnly) {
                    setShowMenu(!showMenu);
                    setPosition(mapPosition(srsRef.current));
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
                    selectableObjects || [],
                    onSelectHandler,
                    selectableAttribute,
                    false,
                    () => setPosition(mapPosition(srsRef.current)),
                    setShowMenu
                )
            }
            ref={srsRef}
        >
            {isReadOnly && (currentValues === undefined || currentValues.length === 0) ? (
                <input
                    name={name}
                    placeholder={placeholder}
                    type="text"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    value={mxFilter}
                    autoComplete="off"
                ></input>
            ) : (
                <CurrentValueSet
                    currentValues={currentValues}
                    displayAttribute={displayAttribute}
                    isClearable={isClearable}
                    isReadOnly={isReadOnly}
                    maxReferenceDisplay={maxReferenceDisplay}
                    onRemove={clickObj =>
                        handleRemoveObj(clickObj, setMxFilter, onSelectAssociation, currentValues || [])
                    }
                    optionTextType={optionTextType}
                    referenceSetStyle={referenceSetStyle}
                    clearIcon={clearIcon}
                    onBadgeClick={onBadgeClick}
                    optionCustomContent={optionCustomContent}
                />
            )}

            {!isReadOnly && (
                <SearchInput
                    currentValue={undefined}
                    displayAttribute={displayAttribute}
                    isReadOnly={isReadOnly}
                    isSearchable={isSearchable}
                    mxFilter={mxFilter}
                    name={name}
                    onChange={handleInputChange}
                    optionCustomContent={optionCustomContent}
                    optionTextType={optionTextType}
                    placeholder={placeholder}
                    setRef={newRef => setSearchInput(newRef)}
                />
            )}

            {!isReadOnly && (
                <div className="srs-icon-row">
                    {showSelectAll && (
                        <SelectAllIcon
                            onClick={event =>
                                handleSelectAll(
                                    event,
                                    setMxFilter,
                                    setFocusedObjIndex,
                                    onSelectAssociation,
                                    selectableObjects || [],
                                    selectableAttribute
                                )
                            }
                            title={"Select All"}
                            mxIconOverride={selectAllIcon}
                        />
                    )}

                    {isClearable && (
                        <ClearIcon
                            onClick={event => {
                                setPosition(mapPosition(srsRef.current));
                                handleClear(
                                    event,
                                    mxFilter,
                                    setMxFilter,
                                    setFocusedObjIndex,
                                    onSelectHandler,
                                    searchInput,
                                    setShowMenu
                                );
                            }}
                            title={"Clear"}
                            mxIconOverride={clearIcon}
                        />
                    )}
                    <DropdownIcon mxIconOverride={dropdownIcon} />
                </div>
            )}
            {showMenu && (
                <OptionsMenu
                    selectableObjects={selectableObjects}
                    displayAttribute={displayAttribute}
                    onSelectOption={(newObject: ObjectItem | undefined) => onSelectHandler(newObject)}
                    currentValue={currentValues}
                    currentFocus={selectableObjects !== undefined ? selectableObjects[focusedObjIndex] : undefined}
                    maxHeight={maxHeight}
                    selectableAttribute={selectableAttribute}
                    noResultsText={noResultsText}
                    optionTextType={optionTextType}
                    optionCustomContent={optionCustomContent}
                    moreResultsText={moreResultsText}
                    optionsStyle={optionsStyle}
                    selectStyle={"dropdown"}
                    position={position}
                    isReadyOnly={isReadOnly}
                    // isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default ReferenceSetDropdown;
