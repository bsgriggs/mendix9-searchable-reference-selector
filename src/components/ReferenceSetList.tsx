import React, { createElement, useState, useRef, ReactElement } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon } from "mendix";
import OptionsMenu from "./OptionsMenu";
import { OptionsStyleEnum, OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import SelectAllIcon from "./icons/SelectAllIcon";
import ClearIcon from "./icons/ClearIcon";
import handleKeyNavigation from "src/utils/handleKeyNavigation";
import handleClear from "src/utils/handleClear";
import handleSelectAll from "src/utils/handleSelectAll";
import handleRemoveObj from "src/utils/handleSelectSet";

interface ReferenceSetListProps {
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
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
}

const ReferenceSetList = ({
    currentValues,
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
    showSelectAll,
    clearIcon,
    displayAttribute,
    moreResultsText,
    noResultsText,
    optionCustomContent,
    placeholder,
    selectAllIcon,
    selectableAttribute,
    tabIndex
}: ReferenceSetListProps): ReactElement => {
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const searchInput = useRef<HTMLInputElement>(null);
    const srsRef = useRef(null);

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
    };

    return (
        <React.Fragment>
            {isSearchable && (
                <div
                    className={"form-control"}
                    tabIndex={tabIndex || 0}
                    onKeyDown={event =>
                        handleKeyNavigation(
                            event,
                            focusedObjIndex,
                            setFocusedObjIndex,
                            selectableObjects,
                            onSelectHandler,
                            selectableAttribute
                        )
                    }
                    ref={srsRef}
                >
                    <input
                        name={name}
                        placeholder={placeholder}
                        type="text"
                        onChange={handleInputChange}
                        readOnly={isReadOnly}
                        value={mxFilter}
                        ref={searchInput}
                    ></input>
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
                                onClick={event =>
                                    handleClear(
                                        event,
                                        mxFilter,
                                        setMxFilter,
                                        setFocusedObjIndex,
                                        onSelectHandler,
                                        searchInput
                                    )
                                }
                                title={"Clear"}
                                mxIconOverride={clearIcon}
                            />
                        )}
                    </div>
                </div>
            )}

            <div className="form-control srs-selectable-list">
                <OptionsMenu
                    selectableObjects={selectableObjects}
                    displayAttribute={displayAttribute}
                    onSelectOption={(newObject: ObjectItem | undefined) => onSelectHandler(newObject)}
                    currentValue={currentValues}
                    currentFocus={selectableObjects[focusedObjIndex]}
                    selectableAttribute={selectableAttribute}
                    noResultsText={noResultsText}
                    optionTextType={optionTextType}
                    optionCustomContent={optionCustomContent}
                    moreResultsText={moreResultsText}
                    optionsStyle={optionsStyle}
                    selectStyle={"list"}
                    isReadyOnly={isReadOnly}
                />
                <div className="srs-icon-row">
                    {isSearchable === false && showSelectAll && isReadOnly === false && (
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
                    {isSearchable === false && isClearable && isReadOnly === false && (
                        <ClearIcon
                            onClick={event =>
                                handleClear(
                                    event,
                                    mxFilter,
                                    setMxFilter,
                                    setFocusedObjIndex,
                                    onSelectHandler,
                                    searchInput
                                )
                            }
                            title={"Clear"}
                            mxIconOverride={clearIcon}
                        />
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default ReferenceSetList;
