import { createElement, useState, useEffect, ReactElement } from "react";
import {
    FilterFunctionEnum,
    SearchableReferenceSelectorMxNineContainerProps
} from "../typings/SearchableReferenceSelectorMxNineProps";
import { ObjectItem, ValueStatus, ActionValue, EditableValue, ReferenceValue, ReferenceSetValue } from "mendix";
import { attribute, literal, contains, startsWith } from "mendix/filters/builders";
import "./ui/SearchableReferenceSelectorMxNine.css";
import { EnumOption } from "typings/general";
import Selector from "./components/Selector";

const callMxAction = (action?: ActionValue): void => {
    if (action !== undefined && action.canExecute && action.isExecuting === false) {
        action.execute();
    }
};

const onSelectEnumerationHandler = (
    currentValue: string | undefined,
    selectedEnum: string | undefined,
    enumAttribute: EditableValue<string>,
    onChange: ActionValue | undefined
): void => {
    if (currentValue !== selectedEnum) {
        enumAttribute.setValue(selectedEnum);
        callMxAction(onChange);
    }
};

const filterOptions = (
    mxFilter: string,
    fullOptions: EnumOption[],
    filterFunction: FilterFunctionEnum
): EnumOption[] => {
    if (mxFilter !== undefined && mxFilter.trim().length > 0) {
        const searchTextTrimmed = mxFilter.trim();
        return filterFunction === "contains"
            ? fullOptions.filter(enumValue => {
                  return enumValue.caption.toLowerCase().includes(searchTextTrimmed.toLowerCase());
              })
            : fullOptions.filter(enumValue => {
                  return enumValue.caption.toLowerCase().startsWith(searchTextTrimmed.toLowerCase());
              });
    } else {
        return fullOptions;
    }
};

const onSelectReferenceHandler = (
    selectedObj: (ObjectItem & ObjectItem[]) | undefined,
    association: ReferenceValue | ReferenceSetValue,
    onChange: ActionValue | undefined
): void => {
    // update Mendix object
    association.setValue(selectedObj);
    // run on change
    callMxAction(onChange);
};

const SearchableReferenceSelector = ({
    association,
    displayAttribute,
    filterDelay,
    id,
    isClearable,
    isSearchable,
    maxItems,
    maxMenuHeight,
    maxReferenceDisplay,
    moreResultsText,
    name,
    noResultsText,
    optionTextType,
    optionsStyleSet,
    optionsStyleSingle,
    selectionType,
    enumAttribute,
    placeholder,
    referenceSetStyle,
    selectStyle,
    showSelectAll,
    clearIcon,
    dropdownIcon,
    onBadgeClick,
    onChange,
    optionCustomContent,
    selectAllIcon,
    selectableAttribute,
    tabIndex,
    selectableObjects,
    filterFunction,
    filterType,
    searchText,
    refreshAction,
    hasMoreResultsManual
}: SearchableReferenceSelectorMxNineContainerProps): ReactElement => {
    const [mxFilter, setMxFilter] = useState<string>("");
    const [refOptions, setRefOptions] = useState<ObjectItem[]>();
    const [enumOptions, setEnumOptions] = useState<EnumOption[]>([]);
    const [enumUniverse, setEnumUniverse] = useState<EnumOption[]>([]);

    if (
        selectionType !== "enumeration" &&
        Number(maxItems.value) > 1
    ) {
        selectableObjects.setLimit(Number(maxItems.value));
    }

    // load Options
    if (selectionType === "enumeration") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (enumAttribute.universe !== undefined) {
                const newUniverse = enumAttribute.universe.map(value => {
                    return {
                        caption: enumAttribute.formatter.format(value),
                        name: value
                    };
                });
                setEnumUniverse(newUniverse);
                setEnumOptions(filterOptions(mxFilter, newUniverse, filterFunction));
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [enumAttribute.universe]);
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (selectableObjects.status === ValueStatus.Available) {
                setRefOptions(selectableObjects.items || []);
            }
        }, [selectableObjects.items]);
    }

    // Determine the Filtering handling useEffect
    if (filterType === "auto") {
        if (selectionType === "enumeration") {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                if (
                    enumAttribute.status === ValueStatus.Available &&
                    placeholder.status === ValueStatus.Available &&
                    maxMenuHeight.status === ValueStatus.Available
                ) {
                    const delayDebounceFn = setTimeout(() => {
                        if (isSearchable) {
                            setEnumOptions(filterOptions(mxFilter, enumUniverse, filterFunction));
                        }
                    }, filterDelay);

                    return () => clearTimeout(delayDebounceFn);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [mxFilter, filterDelay, isSearchable, enumUniverse]);
        } else {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                if (selectableObjects.status === ValueStatus.Available) {
                    const delayDebounceFn = setTimeout(() => {
                        if (isSearchable) {
                            if (displayAttribute.filterable && displayAttribute.type === "String") {
                                // data source supports xpath filtering
                                const filterCondition =
                                    filterFunction === "contains"
                                        ? contains(attribute(displayAttribute.id), literal(mxFilter))
                                        : startsWith(attribute(displayAttribute.id), literal(mxFilter));
                                selectableObjects.setFilter(filterCondition);
                            } else {
                                // data source does not support xpath filter - filter on client
                                if (mxFilter.trim().length > 0 && selectableObjects.items) {
                                    setRefOptions(

                                        selectableObjects.items.filter(obj => {
                                            const text = displayAttribute.get(obj).displayValue as string;
                                            return filterFunction === "contains"
                                            ? text !== undefined &&
                                            text.toLowerCase().includes(mxFilter.trim().toLowerCase())
                                            : text !== undefined &&
                                            text.toLowerCase().startsWith(mxFilter.trim().toLowerCase())
                                        })
                                    );
                                } else {
                                    setRefOptions(selectableObjects.items || []);
                                }
                            }
                        }
                    }, filterDelay);

                    return () => clearTimeout(delayDebounceFn);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [mxFilter]);
        }
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (searchText.status === ValueStatus.Available && searchText.displayValue !== mxFilter) {
                setMxFilter(searchText.displayValue)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [searchText]);        

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (searchText.status === ValueStatus.Available) {
                const delayDebounceFn = setTimeout(() => {
                    if (isSearchable) {
                        searchText.setValue(mxFilter);
                        callMxAction(refreshAction);
                    }
                }, filterDelay);

                return () => clearTimeout(delayDebounceFn);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [mxFilter, filterDelay, isSearchable]);
    }

    return (
        <div id={id} className="srs">
            <Selector
                association={association}
                clearIcon={clearIcon?.value}
                displayAttribute={displayAttribute}
                dropdownIcon={dropdownIcon?.value}
                enumAttribute={enumAttribute}
                enumOptions={enumOptions}
                enumUniverse={enumUniverse}
                isClearable={isClearable}
                selectionType={selectionType}
                selectStyle={selectStyle}
                name={name}
                tabIndex={tabIndex}
                selectAllIcon={selectAllIcon?.value}
                onChange={onChange}
                onBadgeClick={onBadgeClick}
                refOptions={refOptions}
                placeholder={placeholder.value as string}
                isSearchable={isSearchable}
                maxMenuHeight={maxMenuHeight.value || "15em"}
                noResultsText={noResultsText.value as string}
                selectableAttribute={selectableAttribute}
                optionTextType={optionTextType}
                optionCustomContent={optionCustomContent}
                mxFilter={mxFilter}
                setMxFilter={setMxFilter}
                moreResultsText={selectionType !== "enumeration" && ((hasMoreResultsManual && hasMoreResultsManual.value) || selectableObjects.hasMoreItems)? moreResultsText.value : undefined}
                optionsStyleSingle={optionsStyleSingle}
                optionsStyleSet={optionsStyleSet}
                referenceSetStyle={referenceSetStyle}
                maxReferenceDisplay={maxReferenceDisplay}
                showSelectAll={showSelectAll}
                onSelectReference={onSelectReferenceHandler}
                onSelectEnum={onSelectEnumerationHandler}
            />
        </div>
    );
};

export default SearchableReferenceSelector;
