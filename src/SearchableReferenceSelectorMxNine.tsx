import React, { createElement, useMemo } from "react";
import { SearchableReferenceSelectorMxNineContainerProps } from "../typings/SearchableReferenceSelectorMxNineProps";
import { ObjectItem, ValueStatus, ActionValue } from "mendix";
import { attribute, literal, contains, startsWith } from "mendix/filters/builders";
import Selector from "./components/Selector";
import { IOption } from "../typings/option";
import { displayTextContent, displayReferenceContent } from "./utils/displayContent";
import "./ui/SearchableReferenceSelectorMxNine.css";
import { Alert } from "./components/Alert";

export default function SearchableReferenceSelector({
    name,
    tabIndex,
    id,
    isSearchable,
    isClearable,
    showSelectAll,
    maxItems,
    allowLoadingSelect,
    clearSearchOnSelect,
    placeholder,
    moreResultsText,
    noResultsText,
    loadingText,
    selectStyle,
    optionTextType,
    optionsStyleSingle,
    optionsStyleSet,
    optionCustomContent,
    referenceSetStyle,
    referenceSetValue,
    referenceSetValueContent,
    maxReferenceDisplay,
    maxMenuHeight,
    clearIcon,
    dropdownIcon,
    selectAllIcon,
    selectionType,
    selectableObjects,
    reference,
    referenceSet,
    displayAttribute,
    selectableCondition,
    enumAttribute,
    onChange,
    onLeave,
    onBadgeClick,
    filterDelay,
    filterType,
    filterFunction,
    searchText,
    hasMoreResultsManual,
    onClickMoreResultsText,
    refreshAction
}: SearchableReferenceSelectorMxNineContainerProps): React.ReactElement {
    const defaultPageSize = useMemo(
        () => (selectionType !== "enumeration" && maxItems ? Number(maxItems.value) : undefined),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [maxItems]
    );
    const [mxFilter, setMxFilter] = React.useState<string>("");
    const [itemsLimit, setItemsLimit] = React.useState<number | undefined>(defaultPageSize);
    const [options, setOptions] = React.useState<IOption[]>([]);
    const srsRef = React.useRef<HTMLDivElement>(null);

    const isReadOnly = useMemo(
        (): boolean =>
            (selectionType === "reference" && reference.readOnly) ||
            (selectionType === "referenceSet" && referenceSet.readOnly) ||
            (selectionType === "enumeration" && enumAttribute.readOnly),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [reference, referenceSet, enumAttribute]
    );

    const hasMoreItems = useMemo(
        () =>
            (hasMoreResultsManual && hasMoreResultsManual.value) ||
            ((selectableObjects && selectableObjects.hasMoreItems) as boolean),
        [hasMoreResultsManual, selectableObjects]
    );

    if (selectionType !== "enumeration" && filterType === "auto" && Number(maxItems.value) > 1) {
        selectableObjects.setLimit(itemsLimit);
    }

    const handleSelect = React.useCallback(
        (selectedOption: IOption | IOption[] | undefined): void => {
            if (!isReadOnly) {
                const attribute =
                    selectionType === "enumeration"
                        ? enumAttribute
                        : selectionType === "reference"
                        ? reference
                        : referenceSet;
                if (Array.isArray(selectedOption)) {
                    attribute.setValue(selectedOption.map(option => option.id) as string & ObjectItem & ObjectItem[]);
                } else if (selectedOption && selectedOption.isSelectable) {
                    attribute.setValue(selectedOption.id as string & ObjectItem & ObjectItem[]);
                } else {
                    attribute.setValue(undefined);
                }
                callMxAction(onChange, false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isReadOnly, enumAttribute, reference, referenceSet, onChange]
    );

    const mapEnum = React.useCallback(
        (enumArray: string[]): IOption[] =>
            enumArray.map(value => {
                return {
                    content: displayTextContent(enumAttribute.formatter.format(value)),
                    isSelectable: true,
                    isSelected: value === (enumAttribute.value as string),
                    selectionType: "ENUMERATION",
                    id: value
                };
            }),
        [enumAttribute]
    );

    const mapObjectItems = React.useCallback(
        (objectItems: ObjectItem[]): IOption[] =>
            objectItems.map(objItem => {
                return {
                    content: displayReferenceContent(objItem, optionTextType, displayAttribute, optionCustomContent),
                    isSelectable: selectableCondition.get(objItem).value as boolean,
                    isSelected:
                        selectionType === "referenceSet"
                            ? referenceSet.value
                                ? referenceSet.value.find(option => option.id === objItem.id) !== undefined
                                : false
                            : reference.value
                            ? reference.value.id === objItem.id
                            : false,
                    selectionType: "REFERENCE",
                    id: objItem
                };
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [reference, referenceSet, optionTextType, displayAttribute, optionCustomContent, selectableCondition]
    );

    const onShowMore = (newLimit: number | undefined, onClickMoreResultsText: ActionValue | undefined): void => {
        if (filterType === "auto" && newLimit) {
            setItemsLimit(newLimit);
        } else if (onClickMoreResultsText) {
            callMxAction(onClickMoreResultsText, true);
        }
    };

    const callMxAction = (action: ActionValue | undefined, preventConcurrent: boolean): void => {
        if (action !== undefined && action.canExecute && (!preventConcurrent || !action.isExecuting)) {
            action.execute();
        }
    };

    const currentValue: IOption | IOption[] | undefined = useMemo(() => {
        switch (selectionType) {
            case "enumeration":
                return enumAttribute.status === ValueStatus.Available &&
                    enumAttribute.status === ValueStatus.Available &&
                    enumAttribute.value !== undefined
                    ? {
                          content: displayTextContent(enumAttribute.displayValue),
                          isSelectable: true,
                          isSelected: true,
                          selectionType: "ENUMERATION",
                          id: enumAttribute.value
                      }
                    : undefined;
            case "reference":
                return reference.value !== undefined && reference.status === ValueStatus.Available
                    ? {
                          content: displayReferenceContent(
                              reference.value,
                              optionTextType,
                              displayAttribute,
                              optionCustomContent
                          ),
                          isSelectable: selectableCondition.get(reference.value).value as boolean,
                          isSelected: true,
                          selectionType: "REFERENCE",
                          id: reference.value
                      }
                    : undefined;
            case "referenceSet":
                return referenceSet.value !== undefined && referenceSet.status === ValueStatus.Available
                    ? referenceSet.value.map(reference => {
                          return {
                              content: displayReferenceContent(
                                  reference,
                                  optionTextType,
                                  displayAttribute,
                                  optionCustomContent
                              ),
                              badgeContent:
                                  referenceSetValue === "CUSTOM" ? referenceSetValueContent.get(reference) : undefined,
                              isSelectable: selectableCondition.get(reference).value as boolean,
                              isSelected: true,
                              selectionType: "REFERENCE",
                              id: reference
                          };
                      })
                    : undefined;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        enumAttribute,
        reference,
        referenceSet,
        selectableCondition,
        displayAttribute,
        optionCustomContent,
        referenceSetValueContent
    ]);

    // load Options
    if (selectionType === "enumeration") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            // enumAttribute.universe should never change, so this should only run on first load
            if (!isReadOnly && enumAttribute.status === ValueStatus.Available && enumAttribute.universe !== undefined) {
                setOptions(mapEnum(enumAttribute.universe));
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [enumAttribute]);
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            // selectableObjects.items will automatically change when the Mendix data source is re-ran.
            if (
                !isReadOnly &&
                selectableObjects.status === ValueStatus.Available &&
                (reference === undefined || reference.status === ValueStatus.Available) &&
                (referenceSet === undefined || referenceSet.status === ValueStatus.Available)
            ) {
                setOptions(mapObjectItems(selectableObjects.items || []));
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [selectableObjects, reference, referenceSet]);
    }

    // Determine the Filtering handling useEffect
    if (filterType === "auto") {
        if (selectionType === "enumeration") {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
                if (
                    !isReadOnly &&
                    enumAttribute.status === ValueStatus.Available &&
                    placeholder.status === ValueStatus.Available
                ) {
                    const delayDebounceFn = setTimeout(() => {
                        if (isSearchable && enumAttribute.universe !== undefined) {
                            if (mxFilter !== undefined && mxFilter.trim().length > 0) {
                                const searchTextTrimmed = mxFilter.trim();
                                if (filterFunction === "contains") {
                                    setOptions(
                                        mapEnum(
                                            enumAttribute.universe.filter(option =>
                                                option.toLowerCase().includes(searchTextTrimmed.toLowerCase())
                                            )
                                        )
                                    );
                                } else {
                                    setOptions(
                                        mapEnum(
                                            enumAttribute.universe.filter(option =>
                                                option.toLowerCase().startsWith(searchTextTrimmed.toLowerCase())
                                            )
                                        )
                                    );
                                }
                            } else {
                                setOptions(mapEnum(enumAttribute.universe));
                            }
                        }
                    }, filterDelay);

                    return () => clearTimeout(delayDebounceFn);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [mxFilter]);
        } else {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
                if (!isReadOnly && selectableObjects.status === ValueStatus.Available) {
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
                                    setOptions(
                                        mapObjectItems(
                                            selectableObjects.items.filter(obj => {
                                                const text = displayAttribute.get(obj).displayValue as string;
                                                return filterFunction === "contains"
                                                    ? text !== undefined &&
                                                          text.toLowerCase().includes(mxFilter.trim().toLowerCase())
                                                    : text !== undefined &&
                                                          text.toLowerCase().startsWith(mxFilter.trim().toLowerCase());
                                            })
                                        )
                                    );
                                } else {
                                    setOptions(mapObjectItems(selectableObjects.items || []));
                                }
                            }
                            setItemsLimit(defaultPageSize);
                        }
                    }, filterDelay);

                    return () => clearTimeout(delayDebounceFn);
                }
                // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [mxFilter]);
        }
    } else {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            if (searchText.status === ValueStatus.Available && searchText.displayValue !== mxFilter) {
                setMxFilter(searchText.displayValue);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [searchText]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            if (searchText.status === ValueStatus.Available) {
                const delayDebounceFn = setTimeout(() => {
                    if (isSearchable) {
                        searchText.setValue(mxFilter);
                        callMxAction(refreshAction, true);
                    }
                }, filterDelay);

                return () => clearTimeout(delayDebounceFn);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [mxFilter]);
    }

    return (
        <div id={id} className="srs" ref={srsRef}>
            <Selector
                isLoading={selectableObjects && selectableObjects.status === ValueStatus.Loading}
                loadingText={loadingText.value as string}
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
                hasMoreOptions={hasMoreItems}
                moreResultsText={hasMoreItems ? moreResultsText.value : undefined}
                onSelectMoreOptions={
                    itemsLimit && hasMoreItems
                        ? () => onShowMore((itemsLimit || 0) + (defaultPageSize || 0), onClickMoreResultsText)
                        : undefined
                }
                currentValue={currentValue}
                isReadOnly={isReadOnly}
                options={options}
                optionsStyle={selectionType === "referenceSet" ? optionsStyleSet : optionsStyleSingle}
                setMxFilter={setMxFilter}
                onSelect={handleSelect}
                onLeave={() => callMxAction(onLeave, false)}
                srsRef={srsRef}
                allowLoadingSelect={allowLoadingSelect}
                clearSearchOnSelect={clearSearchOnSelect}
            />
            {enumAttribute && enumAttribute.validation && <Alert>{enumAttribute.validation}</Alert>}
            {reference && reference.validation && <Alert>{reference.validation}</Alert>}
            {referenceSet && referenceSet.validation && <Alert>{referenceSet.validation}</Alert>}
        </div>
    );
}
