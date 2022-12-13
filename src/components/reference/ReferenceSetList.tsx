import { createElement, useState, useRef, ReactElement, Fragment, ChangeEvent } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, WebIcon, ListExpressionValue } from "mendix";
import OptionsMenu from "../reference/OptionsMenu";
import {
    OptionsStyleSetEnum,
    OptionTextTypeEnum,
    ReferenceSetStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import handleKeyNavigation from "src/utils/reference/handleKeyNavigation";
import handleClear from "src/utils/handleClear";
import handleSelectAll from "src/utils/reference/handleSelectAll";
import handleRemoveObj from "src/utils/reference/handleSelectSet";
import SearchInput from "../reference/SearchInput";
import CurrentValueSet from "../reference/CurrentValueSet";
import MxIcon from "../MxIcon";

interface ReferenceSetListProps {
    name: string;
    tabIndex: number | undefined;
    placeholder: string | undefined;
    noResultsText: string;
    selectableObjects: ObjectItem[] | undefined;
    currentValues: ObjectItem[] | undefined;
    displayAttribute: ListAttributeValue<string>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent: ListWidgetValue | undefined;
    selectableAttribute: ListExpressionValue<boolean> | undefined;
    onSelectAssociation: (newObject: ObjectItem[] | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon: WebIcon | undefined;
    isSearchable: boolean;
    isReadOnly: boolean;
    showSelectAll: boolean;
    selectAllIcon: WebIcon | undefined;
    moreResultsText: string | undefined;
    optionsStyle: OptionsStyleSetEnum;
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number;
    // isLoading: boolean;
}

const ReferenceSetList = ({
    // isLoading,
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
    tabIndex,
    maxReferenceDisplay,
    referenceSetStyle
}: ReferenceSetListProps): ReactElement => {
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);
    const srsRef = useRef(null);

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

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setMxFilter(value);
        setFocusedObjIndex(0);
    };

    return (
        <Fragment>
            {isSearchable && (
                <div
                    className={`form-control ${isReadOnly ? "read-only" : ""}`}
                    tabIndex={!isReadOnly ? tabIndex || 0 : undefined}
                    onKeyDown={event =>
                        handleKeyNavigation(
                            event,
                            focusedObjIndex,
                            setFocusedObjIndex,
                            selectableObjects || [],
                            onSelectHandler,
                            selectableAttribute,
                            false,
                            isReadOnly
                        )
                    }
                    ref={srsRef}
                >
                    {isReadOnly && currentValues !== undefined && currentValues.length > 0 ? (
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
                            optionCustomContent={optionCustomContent}
                        />
                    ) : (
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
                                <MxIcon
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
                                    defaultClassName="check"
                                />
                            )}
                            {isClearable && (
                                <MxIcon
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
                                    defaultClassName="remove"
                                />
                            )}
                        </div>
                    )}
                </div>
            )}
            {!isReadOnly && (
                <div className="form-control srs-selectable-list">
                    <OptionsMenu
                        selectableObjects={selectableObjects}
                        displayAttribute={displayAttribute}
                        onSelectOption={(newObject: ObjectItem | undefined) => onSelectHandler(newObject)}
                        currentValue={currentValues}
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
                    <div className="srs-icon-row">
                        {isSearchable === false && showSelectAll && (
                            <MxIcon
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
                                defaultClassName="check"
                            />
                        )}
                        {isSearchable === false && isClearable && isReadOnly === false && (
                            <MxIcon
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
                                defaultClassName="remove"
                            />
                        )}
                    </div>
                </div>
            )}
        </Fragment>
    );
};

export default ReferenceSetList;
