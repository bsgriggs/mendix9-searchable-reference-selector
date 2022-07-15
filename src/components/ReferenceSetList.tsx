import React, { createElement, useState, useRef } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon } from "mendix";
import OptionsMenu from "./OptionsMenu";
import { OptionsStyleEnum, OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import Big from "big.js";
import SelectAllIcon from "./icons/SelectAllIcon";
import ClearIcon from "./icons/ClearIcon";

interface ReferenceSetListProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    selectableObjects: ObjectItem[];
    currentValues: ObjectItem[];
    displayAttribute?: ListAttributeValue<string | Big>;
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
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
}

const ReferenceSetList = (props: ReferenceSetListProps): JSX.Element => {
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const searchInput = useRef<HTMLInputElement>(null);
    const srsRef = useRef(null);

    const focusSearchInput = (): void => {
        if (props.currentValues === undefined && searchInput.current !== null) {
            searchInput.current.focus();
        }
    };

    const onSelectHandler = (selectedObj: ObjectItem | undefined): void => {
        if (selectedObj !== undefined) {
            if (props.currentValues.length > 0) {
                if (props.currentValues.find(obj => obj.id === selectedObj.id)) {
                    if (props.isClearable || props.currentValues.length > 1) {
                        // obj already selected , deselect
                        onRemoveHandler(selectedObj);
                    }
                } else {
                    // list already exists, add to list
                    props.onSelectAssociation([...props.currentValues, selectedObj]);
                }
            } else {
                // list is empty, start list
                props.onSelectAssociation([selectedObj]);
            }
        } else {
            // clear all
            props.onSelectAssociation(selectedObj);
        }
        props.setMxFilter("");
    };

    const onRemoveHandler = (removeObj: ObjectItem): void => {
        props.onSelectAssociation(props.currentValues.filter(obj => obj.id !== removeObj.id));
        props.setMxFilter("");
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        props.setMxFilter(value);
        setFocusedObjIndex(0);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        // function to control navigation of the list via arrow keys etc
        const keyPressed = event.key;
        if (keyPressed === "ArrowUp" || keyPressed === "ArrowLeft") {
            if (focusedObjIndex === -1) {
                setFocusedObjIndex(0);
            } else if (focusedObjIndex > 0) {
                setFocusedObjIndex(focusedObjIndex - 1);
            } else {
                setFocusedObjIndex(props.selectableObjects.length - 1);
            }
        } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
            if (focusedObjIndex === -1) {
                setFocusedObjIndex(0);
            } else if (focusedObjIndex < props.selectableObjects.length - 1) {
                setFocusedObjIndex(focusedObjIndex + 1);
            } else {
                setFocusedObjIndex(0);
            }
        } else if (keyPressed === "Enter") {
            if (focusedObjIndex > -1) {
                const currentSelectedObj = props.selectableObjects[focusedObjIndex];
                if (
                    props.selectableAttribute === undefined ||
                    props.selectableAttribute?.get(currentSelectedObj).value
                ) {
                    onSelectHandler(props.selectableObjects[focusedObjIndex]);
                }
            }
        } else if (keyPressed === "Escape" || keyPressed === "Tab") {
            setFocusedObjIndex(-1);
        }
    };

    const handleClear = (event: React.MouseEvent<HTMLDivElement>): void => {
        event.stopPropagation();
        props.setMxFilter("");
        setFocusedObjIndex(-1);
        if (props.mxFilter.trim() === "") {
            onSelectHandler(undefined);
        }
        setTimeout(() => focusSearchInput(), 300);
    };

    const handleSelectAll = (event: React.MouseEvent<HTMLSpanElement>): void => {
        event.stopPropagation();
        props.setMxFilter("");
        setFocusedObjIndex(-1);
        props.onSelectAssociation(
            props.selectableObjects.filter(obj =>
                props.selectableAttribute ? props.selectableAttribute.get(obj).value === true : true
            )
        );
    };

    return (
        <React.Fragment>
            {props.isSearchable && (
                <div
                    className={"form-control"}
                    tabIndex={props.tabIndex || 0}
                    onKeyDown={handleInputKeyDown}
                    ref={srsRef}
                >
                    <input
                        name={props.name}
                        placeholder={props.placeholder}
                        type="text"
                        onChange={handleInputChange}
                        readOnly={props.isReadOnly}
                        value={props.mxFilter}
                        ref={searchInput}
                    ></input>
                    <div className="srs-icon-row">
                        {props.showSelectAll && props.isReadOnly === false && (
                            <SelectAllIcon
                                onClick={handleSelectAll}
                                title={"Select All"}
                                mxIconOverride={props.selectAllIcon}
                            />
                        )}
                        {props.isClearable && props.isReadOnly === false && (
                            <ClearIcon onClick={handleClear} title={"Clear"} mxIconOverride={props.clearIcon} />
                        )}
                    </div>
                </div>
            )}

            <div className="form-control srs-selectable-list">
                <OptionsMenu
                    selectableObjects={props.selectableObjects}
                    displayAttribute={props.displayAttribute}
                    onSelectOption={(newObject: ObjectItem | undefined) => onSelectHandler(newObject)}
                    currentValue={props.currentValues}
                    currentFocus={props.selectableObjects[focusedObjIndex]}
                    searchText={props.mxFilter}
                    selectableAttribute={props.selectableAttribute}
                    noResultsText={props.noResultsText}
                    optionTextType={props.optionTextType}
                    optionCustomContent={props.optionCustomContent}
                    moreResultsText={props.moreResultsText}
                    optionsStyle={props.optionsStyle}
                    selectStyle={"list"}
                    isReadyOnly={props.isReadOnly}
                />
                <div className="srs-icon-row">
                    {props.isSearchable === false && props.showSelectAll && props.isReadOnly === false && (
                        <SelectAllIcon
                            onClick={handleSelectAll}
                            title={"Select All"}
                            mxIconOverride={props.selectAllIcon}
                        />
                    )}
                    {props.isSearchable === false && props.isClearable && props.isReadOnly === false && (
                        <ClearIcon onClick={handleClear} title={"Clear"} mxIconOverride={props.clearIcon} />
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default ReferenceSetList;
