import React, { createElement, useState, useRef, ReactElement, Fragment } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon } from "mendix";
import ClearIcon from "./icons/ClearIcon";
import DropdownIcon from "./icons/DropdownIcon";
import OptionsMenu from "./OptionsMenu";
import { OptionsStyleEnum, OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import displayContent from "src/utils/displayContent";
import usePositionUpdate, { mapPosition, Position } from "../custom hooks/usePositionUpdate";
import focusSearchInput from "../utils/focusSearchInput";
import handleKeyNavigation from "../utils/handleKeyNavigation";
import handleClear from "src/utils/handleClear";

interface ReferenceDropdownProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    selectableObjects: ObjectItem[] | undefined;
    currentValue?: ObjectItem | undefined;
    displayAttribute?: ListAttributeValue<string>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectAssociation: (newObject: ObjectItem | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon?: DynamicValue<WebIcon>;
    dropdownIcon?: DynamicValue<WebIcon>;
    isSearchable: boolean;
    isReadOnly: boolean;
    maxHeight?: string;
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
    // isLoading: boolean;
}

const ReferenceDropdown = ({
    // isLoading,
    isClearable,
    isReadOnly,
    isSearchable,
    mxFilter,
    name,
    onSelectAssociation,
    optionTextType,
    optionsStyle,
    selectableObjects,
    setMxFilter,
    clearIcon,
    currentValue,
    displayAttribute,
    dropdownIcon,
    maxHeight,
    moreResultsText,
    noResultsText,
    optionCustomContent,
    placeholder,
    selectableAttribute,
    tabIndex
}: ReferenceDropdownProps): ReactElement => {
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

    const onSelectHandler = (selectedObj: ObjectItem | undefined, closeMenu: boolean): void => {
        if (currentValue?.id === selectedObj?.id && isClearable) {
            onSelectAssociation(undefined);
        } else {
            onSelectAssociation(selectedObj);
        }
        setMxFilter("");
        if (closeMenu) {
            setShowMenu(false);
        }
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
                    selectableObjects || [],
                    onSelectHandler,
                    selectableAttribute,
                    setShowMenu
                )
            }
            ref={srsRef}
        >
            {optionTextType === "text" && (
                <input
                    name={name}
                    placeholder={placeholder}
                    type="text"
                    onChange={handleInputChange}
                    readOnly={isReadOnly || currentValue !== undefined || !isSearchable}
                    value={
                        currentValue !== undefined && displayAttribute !== undefined
                            ? displayAttribute.get(currentValue).displayValue
                            : mxFilter
                    }
                    ref={searchInput}
                    onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                        if (showMenu) {
                            event.stopPropagation();
                        }
                    }}
                ></input>
            )}
            {optionTextType !== "text" && (
                <Fragment>
                    {currentValue === undefined && isReadOnly === false && isSearchable && (
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
                    {currentValue === undefined && isSearchable === false && (
                        <span className="srs-text">{placeholder}</span>
                    )}
                    {currentValue !== undefined &&
                        displayContent(currentValue, optionTextType, displayAttribute, optionCustomContent, "srs-text")}
                </Fragment>
            )}

            <div className="srs-icon-row">
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
                    onSelectOption={(newObject: ObjectItem | undefined) => {
                        const newObjSelectable =
                            newObject !== undefined && selectableAttribute !== undefined
                                ? selectableAttribute.get(newObject).value === true
                                : true;
                        onSelectHandler(newObject, newObjSelectable);
                    }}
                    currentValue={currentValue}
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

export default ReferenceDropdown;
