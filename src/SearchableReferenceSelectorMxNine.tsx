import { createElement, useState, useEffect, ReactElement, useRef } from "react";
import {
    FilterTypeEnum,
    OptionTextTypeEnum,
    SearchableReferenceSelectorMxNineContainerProps
} from "../typings/SearchableReferenceSelectorMxNineProps";
import {
    ObjectItem,
    ValueStatus,
    ActionValue,
    EditableValue,
    ReferenceValue,
    ReferenceSetValue,
    ListAttributeValue,
    ListExpressionValue,
    ListWidgetValue
} from "mendix";
import { attribute, literal, contains, startsWith } from "mendix/filters/builders";
import Selector from "./components/Selector";
import { IOption } from "../typings/option";
import { displayTextContent, displayReferenceContent } from "./utils/displayContent";
import "./ui/SearchableReferenceSelectorMxNine.css";
import { Alert } from "./components/Alert";

const callMxAction = (action: ActionValue | undefined, preventConcurrent: boolean): void => {
    if (action !== undefined && action.canExecute && (!preventConcurrent || !action.isExecuting)) {
        action.execute();
    }
};

const handleSelect = (
    isReadOnly: boolean,
    selectedOption: IOption | IOption[] | undefined,
    onChange: ActionValue | undefined,
    attribute: EditableValue<string> | ReferenceValue | ReferenceSetValue
): void => {
    if (!isReadOnly) {
        if (Array.isArray(selectedOption)) {
            attribute.setValue(selectedOption.map(option => option.id) as string & ObjectItem & ObjectItem[]);
        } else if (selectedOption && selectedOption.isSelectable) {
            attribute.setValue(selectedOption.id as string & ObjectItem & ObjectItem[]);
        } else {
            attribute.setValue(undefined);
        }
        callMxAction(onChange, false);
    }
};

const mapEnum = (enumArray: string[], enumAttribute: EditableValue<string>): IOption[] =>
    enumArray.map(value => {
        return {
            content: displayTextContent(enumAttribute.formatter.format(value)),
            isSelectable: true,
            isSelected: value === (enumAttribute.value as string),
            selectionType: "enumeration",
            id: value
        };
    });

const mapObjectItems = (
    objectItems: ObjectItem[] | undefined,
    optionTextType: OptionTextTypeEnum,
    displayAttribute: ListAttributeValue<string> | undefined,
    optionCustomContent: ListWidgetValue | undefined,
    selectableCondition: ListExpressionValue<boolean>,
    association: ReferenceValue | ReferenceSetValue
): IOption[] =>
    objectItems
        ? objectItems.map(objItem => {
              return {
                  content: displayReferenceContent(objItem, optionTextType, displayAttribute, optionCustomContent),
                  isSelectable: selectableCondition.get(objItem).value as boolean,
                  isSelected:
                      association.type === "ReferenceSet"
                          ? association.value
                              ? association.value.find(option => option.id === objItem.id) !== undefined
                              : false
                          : association.value
                          ? association.value.id === objItem.id
                          : false,
                  selectionType: "reference",
                  id: objItem
              };
          })
        : [];

const onShowMore = (
    filterType: FilterTypeEnum,
    newLimit: number | undefined,
    setItemsLimit: (newLimit: number) => void,
    onClickMoreResultsText: ActionValue | undefined
): void => {
    if (filterType === "auto" && newLimit) {
        setItemsLimit(newLimit);
    } else if (onClickMoreResultsText) {
        callMxAction(onClickMoreResultsText, true);
    }
};

export default function SearchableReferenceSelector({
    reference,
    referenceSet,
    displayAttribute,
    filterDelay,
    isClearable,
    isSearchable,
    maxItems,
    maxMenuHeight,
    maxReferenceDisplay,
    moreResultsText,
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
    onLeave,
    optionCustomContent,
    selectAllIcon,
    selectableCondition,
    selectableObjects,
    filterFunction,
    filterType,
    searchText,
    refreshAction,
    hasMoreResultsManual,
    name,
    onClickMoreResultsText,
    id,
    tabIndex
}: SearchableReferenceSelectorMxNineContainerProps): ReactElement {
    const defaultPageSize = selectionType !== "enumeration" && maxItems ? Number(maxItems.value) : undefined;
    const [searchFilter, setSearchFilter] = useState<string>("");
    const [itemsLimit, setItemsLimit] = useState<number | undefined>(defaultPageSize);
    const [options, setOptions] = useState<IOption[]>([]);
    const [currentValue, setCurrentValue] = useState<IOption | IOption[] | undefined>();
    const srsRef = useRef<HTMLDivElement>(null);

    const isReadOnly =
        (reference && reference.readOnly) ||
        (referenceSet && referenceSet.readOnly) ||
        (enumAttribute && enumAttribute.readOnly);

    if (selectionType !== "enumeration" && filterType === "auto" && Number(maxItems.value) > 1) {
        selectableObjects.setLimit(itemsLimit);
    }

    // set current value
    switch (selectionType) {
        case "enumeration":
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                if (enumAttribute.status === ValueStatus.Available && enumAttribute.status === ValueStatus.Available) {
                    if (enumAttribute.value !== undefined) {
                        setCurrentValue({
                            content: displayTextContent(enumAttribute.displayValue),
                            isSelectable: true,
                            isSelected: true,
                            selectionType: "enumeration",
                            id: enumAttribute.value
                        });
                    } else {
                        setCurrentValue(undefined);
                    }
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [enumAttribute.value]);
            break;
        case "reference":
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                if (reference.value !== undefined && reference.status === ValueStatus.Available) {
                    setCurrentValue({
                        content: displayReferenceContent(
                            reference.value,
                            optionTextType,
                            displayAttribute,
                            optionCustomContent
                        ),
                        isSelectable: selectableCondition.get(reference.value).value as boolean,
                        isSelected: true,
                        selectionType: "reference",
                        id: reference.value
                    });
                } else {
                    setCurrentValue(undefined);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [reference.value]);
            break;
        case "referenceSet":
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                if (referenceSet.value !== undefined && referenceSet.status === ValueStatus.Available) {
                    setCurrentValue(
                        referenceSet.value.map(reference => {
                            return {
                                content: displayReferenceContent(
                                    reference,
                                    optionTextType,
                                    displayAttribute,
                                    optionCustomContent
                                ),
                                isSelectable: selectableCondition.get(reference).value as boolean,
                                isSelected: true,
                                selectionType: "reference",
                                id: reference
                            };
                        })
                    );
                } else {
                    setCurrentValue(undefined);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [referenceSet.value]);
            break;
    }

    // load Options
    if (selectionType === "enumeration") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            // enumAttribute.universe should never change, so this should only run on first load
            if (enumAttribute.status === ValueStatus.Available && enumAttribute.universe !== undefined) {
                setOptions(mapEnum(enumAttribute.universe, enumAttribute));
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [enumAttribute]);
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            // selectableObjects.items will automatically change when the Mendix data source is re-ran.
            if (
                selectableObjects.status === ValueStatus.Available &&
                (reference === undefined || reference.status === ValueStatus.Available) &&
                (referenceSet === undefined || referenceSet.status === ValueStatus.Available)
            ) {
                setOptions(
                    mapObjectItems(
                        selectableObjects.items,
                        optionTextType,
                        displayAttribute,
                        optionCustomContent,
                        selectableCondition,
                        selectionType === "reference" ? reference : referenceSet
                    )
                );
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectableObjects.items, reference, referenceSet]);
    }

    // Determine the Filtering handling useEffect
    if (filterType === "auto") {
        if (selectionType === "enumeration") {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
                if (enumAttribute.status === ValueStatus.Available && placeholder.status === ValueStatus.Available) {
                    const delayDebounceFn = setTimeout(() => {
                        if (isSearchable && enumAttribute.universe !== undefined) {
                            if (searchFilter !== undefined && searchFilter.trim().length > 0) {
                                const searchTextTrimmed = searchFilter.trim();
                                if (filterFunction === "contains") {
                                    setOptions(
                                        mapEnum(
                                            enumAttribute.universe.filter(option =>
                                                option.toLowerCase().includes(searchTextTrimmed.toLowerCase())
                                            ),
                                            enumAttribute
                                        )
                                    );
                                } else {
                                    setOptions(
                                        mapEnum(
                                            enumAttribute.universe.filter(option =>
                                                option.toLowerCase().startsWith(searchTextTrimmed.toLowerCase())
                                            ),
                                            enumAttribute
                                        )
                                    );
                                }
                            } else {
                                setOptions(mapEnum(enumAttribute.universe, enumAttribute));
                            }
                        }
                    }, filterDelay);

                    return () => clearTimeout(delayDebounceFn);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [searchFilter]);
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
                                        ? contains(attribute(displayAttribute.id), literal(searchFilter))
                                        : startsWith(attribute(displayAttribute.id), literal(searchFilter));
                                selectableObjects.setFilter(filterCondition);
                            } else {
                                // data source does not support xpath filter - filter on client
                                if (searchFilter.trim().length > 0 && selectableObjects.items) {
                                    setOptions(
                                        mapObjectItems(
                                            selectableObjects.items.filter(obj => {
                                                const text = displayAttribute.get(obj).displayValue as string;
                                                return filterFunction === "contains"
                                                    ? text !== undefined &&
                                                          text.toLowerCase().includes(searchFilter.trim().toLowerCase())
                                                    : text !== undefined &&
                                                          text
                                                              .toLowerCase()
                                                              .startsWith(searchFilter.trim().toLowerCase());
                                            }),
                                            optionTextType,
                                            displayAttribute,
                                            optionCustomContent,
                                            selectableCondition,
                                            selectionType === "reference" ? reference : referenceSet
                                        )
                                    );
                                } else {
                                    setOptions(
                                        mapObjectItems(
                                            selectableObjects.items,
                                            optionTextType,
                                            displayAttribute,
                                            optionCustomContent,
                                            selectableCondition,
                                            selectionType === "reference" ? reference : referenceSet
                                        )
                                    );
                                }
                            }
                            setItemsLimit(defaultPageSize);
                        }
                    }, filterDelay);

                    return () => clearTimeout(delayDebounceFn);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [searchFilter]);
        }
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (searchText.status === ValueStatus.Available && searchText.displayValue !== searchFilter) {
                setSearchFilter(searchText.displayValue);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [searchText]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (searchText.status === ValueStatus.Available) {
                const delayDebounceFn = setTimeout(() => {
                    if (isSearchable) {
                        searchText.setValue(searchFilter);
                        callMxAction(refreshAction, true);
                    }
                }, filterDelay);

                return () => clearTimeout(delayDebounceFn);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [searchFilter]);
    }

    return (
        <div id={id} className="srs" ref={srsRef}>
            <Selector
                clearIcon={clearIcon?.value}
                dropdownIcon={dropdownIcon?.value}
                isClearable={isClearable}
                selectionType={selectionType}
                selectStyle={selectStyle}
                name={name}
                tabIndex={tabIndex}
                selectAllIcon={selectAllIcon?.value}
                onBadgeClick={selectedOption =>
                    onBadgeClick ? callMxAction(onBadgeClick.get(selectedOption.id as ObjectItem), false) : undefined
                }
                placeholder={placeholder.value as string}
                isSearchable={isSearchable}
                maxMenuHeight={maxMenuHeight.value || "15em"}
                noResultsText={noResultsText.value as string}
                referenceSetStyle={referenceSetStyle}
                maxReferenceDisplay={maxReferenceDisplay}
                showSelectAll={showSelectAll}
                hasMoreOptions={
                    (hasMoreResultsManual && hasMoreResultsManual.value) ||
                    ((selectableObjects && selectableObjects.hasMoreItems) as boolean)
                }
                moreResultsText={
                    selectionType !== "enumeration" &&
                    ((hasMoreResultsManual && hasMoreResultsManual.value) || selectableObjects.hasMoreItems)
                        ? moreResultsText.value
                        : undefined
                }
                onSelectMoreOptions={
                    itemsLimit && defaultPageSize && (selectableObjects.hasMoreItems || hasMoreResultsManual?.value)
                        ? () =>
                              onShowMore(
                                  filterType,
                                  (itemsLimit || 0) + (defaultPageSize || 0),
                                  setItemsLimit,
                                  onClickMoreResultsText
                              )
                        : undefined
                }
                currentValue={currentValue}
                isReadOnly={isReadOnly}
                options={options}
                optionsStyle={selectionType === "referenceSet" ? optionsStyleSet : optionsStyleSingle}
                searchFilter={searchFilter}
                setSearchFilter={setSearchFilter}
                onSelect={(selectedOption: IOption) => {
                    handleSelect(
                        isReadOnly,
                        selectedOption,
                        onChange,
                        selectionType === "enumeration"
                            ? enumAttribute
                            : selectionType === "reference"
                            ? reference
                            : referenceSet
                    );
                }}
                onLeave={() => {
                    if (onLeave) {
                        callMxAction(onLeave, false);
                    }
                }}
                srsRef={srsRef}
            />
            {enumAttribute && enumAttribute.validation && <Alert>{enumAttribute.validation}</Alert>}
            {reference && reference.validation && <Alert>{reference.validation}</Alert>}
            {referenceSet && referenceSet.validation && <Alert>{referenceSet.validation}</Alert>}
        </div>
    );
}
