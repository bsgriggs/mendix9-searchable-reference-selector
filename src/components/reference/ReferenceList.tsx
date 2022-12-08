import { createElement, useState, useRef, ReactElement, Fragment, ChangeEvent } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, WebIcon } from "mendix";
import OptionsMenu from "../reference/OptionsMenu";
import { OptionsStyleSingleEnum, OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import handleKeyNavigation from "src/utils/reference/handleKeyNavigation";
import handleClear from "src/utils/handleClear";
import SearchInput from "../reference/SearchInput";
import MxIcon from "../MxIcon";

interface ReferenceListProps {
    name: string;
    tabIndex: number | undefined;
    placeholder: string | undefined;
    noResultsText: string;
    selectableObjects: ObjectItem[] | undefined;
    currentValue: ObjectItem | undefined;
    displayAttribute: ListAttributeValue<string>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent: ListWidgetValue | undefined;
    selectableAttribute: ListAttributeValue<boolean> | undefined;
    onSelectAssociation: (newObject: ObjectItem | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon: WebIcon | undefined;
    isSearchable: boolean;
    isReadOnly: boolean;
    moreResultsText: string | undefined;
    optionsStyle: OptionsStyleSingleEnum;
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
                            isReadOnly,
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
                        isReadyOnly={isReadOnly} // isLoading={isLoading}
                    />
                    {isSearchable === false && isClearable && (
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
        </Fragment>
    );
};

export default ReferenceList;
