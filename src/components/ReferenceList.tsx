import React, { createElement, useState, useRef, ReactElement } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon } from "mendix";
import OptionsMenu from "./OptionsMenu";
import { OptionsStyleEnum, OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import ClearIcon from "./icons/ClearIcon";
import handleKeyNavigation from "src/utils/handleKeyNavigation";
import handleClear from "src/utils/handleClear";
import SearchInput from "./SearchInput";

interface ReferenceListProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    selectableObjects: ObjectItem[] | undefined;
    currentValue?: ObjectItem | undefined;
    displayAttribute: ListAttributeValue<string>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectAssociation: (newObject: ObjectItem | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon?: DynamicValue<WebIcon>;
    isSearchable: boolean;
    isReadOnly: boolean;
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
    // isLoading: boolean;
}

const ReferenceList = ({
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
    moreResultsText,
    noResultsText,
    optionCustomContent,
    placeholder,
    selectableAttribute,
    tabIndex
}: ReferenceListProps): ReactElement => {
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);
    const srsRef = useRef(null);

    const onSelectHandler = (selectedObj: ObjectItem | undefined): void => {
        if (currentValue?.id === selectedObj?.id && isClearable) {
            onSelectAssociation(undefined);
        } else {
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
                className={`form-control ${isReadOnly? "read-only": ""}`}
                    tabIndex={!isReadOnly ? tabIndex || 0 : undefined}
                    onKeyDown={event =>
                        handleKeyNavigation(
                            event,
                            focusedObjIndex,
                            setFocusedObjIndex,
                            selectableObjects || [],
                            onSelectHandler,
                            selectableAttribute,
                            false
                        )
                    }
                    ref={srsRef}
                >
                    <SearchInput
                        currentValue={currentValue}
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

                    {isClearable && !isReadOnly && (
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
            )}
            {!isReadOnly && (
                <div className="form-control srs-selectable-list">
                    <OptionsMenu
                        selectableObjects={selectableObjects}
                        displayAttribute={displayAttribute}
                        onSelectOption={(newObject: ObjectItem | undefined) => {
                            const newObjSelectable =
                                newObject !== undefined && selectableAttribute !== undefined
                                    ? selectableAttribute.get(newObject).value === true
                                    : true;
                            if (newObjSelectable) {
                                onSelectHandler(newObject);
                            }
                        }}
                        currentValue={currentValue}
                        currentFocus={selectableObjects !== undefined ? selectableObjects[focusedObjIndex] : undefined}
                        selectableAttribute={selectableAttribute}
                        noResultsText={noResultsText}
                        optionTextType={optionTextType}
                        optionCustomContent={optionCustomContent}
                        moreResultsText={moreResultsText}
                        optionsStyle={optionsStyle}
                        selectStyle={"list"}
                        isReadyOnly={isReadOnly}
                        // isLoading={isLoading}
                    />
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
            )}
        </React.Fragment>
    );
};

export default ReferenceList;
