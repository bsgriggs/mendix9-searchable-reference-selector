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
import Badge from "./Badge";
import Comma from "./Comma";
import SelectAllIcon from "./icons/SelectAllIcon";
import ClearIcon from "./icons/ClearIcon";
import focusSearchInput from "../utils/focusSearchInput";
import handleKeyNavigation from "src/utils/handleKeyNavigation";
import handleClear from "src/utils/handleClear";
import handleSelectAll from "src/utils/handleSelectAll";
import handleRemoveObj from "src/utils/handleSelectSet";

interface ReferenceSetDropdownProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    selectableObjects: ObjectItem[];
    currentValues: ObjectItem[];
    displayAttribute?: ListAttributeValue<string>;
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
}

const ReferenceSetDropdown = ({
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
    const searchInput = useRef<HTMLInputElement>(null);
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
            if (currentValues.length > 0) {
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
            className={showMenu ? "form-control active" : "form-control"}
            tabIndex={tabIndex || 0}
            onClick={() => {
                setShowMenu(!showMenu);
                setPosition(mapPosition(srsRef.current));
                if (showMenu === false) {
                    focusSearchInput(searchInput, 300);
                }
            }}
            onKeyDown={event =>
                handleKeyNavigation(
                    event,
                    focusedObjIndex,
                    setFocusedObjIndex,
                    selectableObjects,
                    onSelectHandler,
                    selectableAttribute,
                    setShowMenu
                )
            }
            ref={srsRef}
        >
            {referenceSetStyle === "badges" && currentValues.length > 0 && (
                <div className="srs-badge-row">
                    {maxReferenceDisplay > 0 && (
                        <React.Fragment>
                            {currentValues.slice(0, maxReferenceDisplay).map((currentValue: ObjectItem, key) => (
                                <Badge
                                    key={key}
                                    content={currentValue}
                                    isClearable={isClearable || currentValues.length > 1}
                                    isReadOnly={isReadOnly}
                                    optionTextType={optionTextType}
                                    onRemoveAssociation={() =>
                                        handleRemoveObj(currentValue, setMxFilter, onSelectAssociation, currentValues)
                                    }
                                    displayAttribute={displayAttribute}
                                    clearIcon={clearIcon}
                                    onBadgeClick={onBadgeClick}
                                />
                            ))}
                        </React.Fragment>
                    )}
                    {maxReferenceDisplay <= 0 && (
                        <React.Fragment>
                            {currentValues.map((currentValue: ObjectItem, key) => (
                                <Badge
                                    key={key}
                                    content={currentValue}
                                    isClearable={isClearable || currentValues.length > 1}
                                    isReadOnly={isReadOnly}
                                    optionTextType={optionTextType}
                                    onRemoveAssociation={() =>
                                        handleRemoveObj(currentValue, setMxFilter, onSelectAssociation, currentValues)
                                    }
                                    displayAttribute={displayAttribute}
                                    clearIcon={clearIcon}
                                    onBadgeClick={onBadgeClick}
                                />
                            ))}
                        </React.Fragment>
                    )}
                    {currentValues.length > maxReferenceDisplay && maxReferenceDisplay > 0 && (
                        <span className="srs-extra">{`(+ ${currentValues.length - maxReferenceDisplay})`}</span>
                    )}
                </div>
            )}
            {referenceSetStyle === "commas" && currentValues.length > 0 && (
                <div className="srs-badge-row">
                    {maxReferenceDisplay > 0 && (
                        <React.Fragment>
                            {currentValues.slice(0, maxReferenceDisplay).map((currentValue: ObjectItem, index) => (
                                <React.Fragment key={index}>
                                    <Comma
                                        content={currentValue}
                                        optionTextType={optionTextType}
                                        displayAttribute={displayAttribute}
                                        showComma={
                                            index < currentValues.length - 1 && index !== maxReferenceDisplay - 1
                                        }
                                    />
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    )}
                    {maxReferenceDisplay <= 0 && (
                        <React.Fragment>
                            {currentValues.map((currentValue: ObjectItem, index) => (
                                <React.Fragment key={index}>
                                    <Comma
                                        content={currentValue}
                                        optionTextType={optionTextType}
                                        displayAttribute={displayAttribute}
                                        showComma={
                                            index < currentValues.length - 1 && index !== maxReferenceDisplay - 1
                                        }
                                    />
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    )}

                    {currentValues.length > maxReferenceDisplay && maxReferenceDisplay > 0 && (
                        <span className="srs-extra">{`(+ ${currentValues.length - maxReferenceDisplay})`}</span>
                    )}
                </div>
            )}

            {isSearchable && (
                <input
                    name={name}
                    placeholder={placeholder}
                    type="text"
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    value={mxFilter}
                    ref={searchInput}
                    onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                        if (showMenu) {
                            event.stopPropagation();
                        }
                    }}
                ></input>
            )}

            {isSearchable === false && <span className="srs-text">{placeholder}</span>}

            <div className="srs-icon-row">
                {showSelectAll && isReadOnly === false && (
                    <SelectAllIcon
                        onClick={event =>
                            handleSelectAll(
                                event,
                                setMxFilter,
                                setFocusedObjIndex,
                                onSelectAssociation,
                                selectableObjects,
                                selectableAttribute
                            )
                        }
                        title={"Select All"}
                        mxIconOverride={selectAllIcon}
                    />
                )}

                {isClearable && isReadOnly === false && (
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
            {showMenu && (
                <OptionsMenu
                    selectableObjects={selectableObjects}
                    displayAttribute={displayAttribute}
                    onSelectOption={(newObject: ObjectItem | undefined) => onSelectHandler(newObject)}
                    currentValue={currentValues}
                    currentFocus={selectableObjects[focusedObjIndex]}
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
                />
            )}
        </div>
    );
};

export default ReferenceSetDropdown;
