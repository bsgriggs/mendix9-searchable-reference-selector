import React, { Fragment, ReactNode, createElement, useCallback, useMemo } from "react";
import { SearchableReferenceSelectorMxNineContainerProps } from "../typings/SearchableReferenceSelectorMxNineProps";
import { ObjectItem, ValueStatus, ActionValue } from "mendix";
import { attribute, literal, contains, startsWith, or } from "mendix/filters/builders";
import Selector from "./components/Selector";
import { IOption } from "../typings/option";
import "./ui/SearchableReferenceSelectorMxNine.scss";
import { Alert } from "./components/Alert";

export default function SearchableReferenceSelector({
    id,
    name,
    tabIndex,
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
    optionsStyleSingle,
    optionsStyleSet,
    optionCustomContent,
    referenceSetStyle,
    referenceSetValue,
    referenceSetValueContent,
    maxReferenceDisplay,
    maxMenuHeight,
    clearIcon,
    clearIconTitle,
    dropdownIcon,
    selectAllIcon,
    selectAllIconTitle,
    selectionType,
    selectableObjects,
    reference,
    referenceSet,
    searchAttributes,
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
    ariaLiveText,
    displayAttribute,
    optionExpression,
    optionTextType,
    isCompact,
    badgeColor
}: SearchableReferenceSelectorMxNineContainerProps): React.ReactElement {
    const defaultPageSize = useMemo(
        () => (selectionType !== "enumeration" && maxItems ? Number(maxItems.value) : undefined),
        [maxItems, selectionType]
    );
    const [mxFilter, setMxFilter] = React.useState<string>("");
    const [itemsLimit, setItemsLimit] = React.useState<number | undefined>(defaultPageSize);
    const [options, setOptions] = React.useState<IOption[]>([]);
    const srsRef = React.useRef<HTMLDivElement>(null);
    const serverSideSearching: boolean = useMemo(() => {
        if (selectionType === "enumeration") {
            return false;
        }
        return optionTextType === "text" || optionTextType === "html"
            ? displayAttribute.type !== "Enum" && displayAttribute.filterable
            : searchAttributes.every(
                  value => value.searchAttribute.type !== "Enum" && value.searchAttribute.filterable
              );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isReadOnly = useMemo(
        (): boolean =>
            (selectionType === "reference" && reference.readOnly) ||
            (selectionType === "referenceSet" && referenceSet.readOnly) ||
            (selectionType === "enumeration" && enumAttribute.readOnly),
        [reference, referenceSet, enumAttribute, selectionType]
    );

    const hasMoreItems = useMemo(
        () =>
            (hasMoreResultsManual && hasMoreResultsManual.value) ||
            (((selectableObjects && selectableObjects.hasMoreItems) as boolean) && serverSideSearching),
        [hasMoreResultsManual, selectableObjects, serverSideSearching]
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

        [isReadOnly, enumAttribute, reference, referenceSet, onChange, selectionType]
    );

    const displayTextContent = useCallback((text: string): ReactNode => <span>{text}</span>, []);

    const displayReferenceContent = useCallback(
        (displayObj: ObjectItem): ReactNode =>
            optionTextType === "text" ? (
                <span>{displayAttribute.get(displayObj).value}</span>
            ) : optionTextType === "html" ? (
                <span
                    dangerouslySetInnerHTML={{
                        __html: `${displayAttribute.get(displayObj).value?.toString()}`
                    }}
                ></span>
            ) : optionTextType === "textTemplate" ? (
                <span>{optionExpression.get(displayObj).value}</span>
            ) : (
                <span>{optionCustomContent.get(displayObj)}</span>
            ),
        [optionTextType, optionCustomContent, displayAttribute, optionExpression]
    );

    const mapEnum = React.useCallback(
        (enumArray: string[]): IOption[] =>
            enumArray.map(value => {
                return {
                    content: displayTextContent(enumAttribute.formatter.format(value)),
                    isSelectable: true,
                    isSelected: value === (enumAttribute.value as string),
                    selectionType: "ENUMERATION",
                    id: value,
                    ariaLiveText: enumAttribute.formatter.format(value)
                };
            }),
        [enumAttribute, displayTextContent]
    );

    const mapAriaLiveText = React.useCallback(
        (objectItem: ObjectItem): string =>
            ariaLiveText
                ? (ariaLiveText.get(objectItem).value as string)
                : displayAttribute
                ? (displayAttribute.get(objectItem).value as string)
                : optionExpression
                ? (optionExpression.get(objectItem).value as string)
                : "",
        [ariaLiveText, displayAttribute, optionExpression]
    );

    const mapObjectItems = React.useCallback(
        (objectItems: ObjectItem[]): IOption[] =>
            objectItems.map(objItem => {
                return {
                    content: displayReferenceContent(objItem),
                    isSelectable: selectableCondition.get(objItem).value as boolean,
                    isSelected:
                        selectionType === "referenceSet"
                            ? referenceSet.value?.find(option => option.id === objItem.id) !== undefined
                            : reference.value?.id === objItem.id,

                    selectionType: "REFERENCE",
                    id: objItem,
                    ariaLiveText: mapAriaLiveText(objItem)
                };
            }),

        [reference, referenceSet, selectableCondition, displayReferenceContent, mapAriaLiveText, selectionType]
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
                          id: enumAttribute.value,
                          ariaLiveText: enumAttribute.displayValue
                      }
                    : undefined;
            case "reference":
                return reference.value !== undefined && reference.status === ValueStatus.Available
                    ? {
                          content: displayReferenceContent(reference.value),
                          isSelectable: selectableCondition.get(reference.value).value as boolean,
                          isSelected: true,
                          selectionType: "REFERENCE",
                          id: reference.value,
                          ariaLiveText: mapAriaLiveText(reference.value)
                      }
                    : undefined;
            case "referenceSet":
                return referenceSet.value !== undefined && referenceSet.status === ValueStatus.Available
                    ? referenceSet.value.map(reference => {
                          return {
                              content: displayReferenceContent(reference),
                              badgeContent:
                                  referenceSetValue === "CUSTOM" ? referenceSetValueContent.get(reference) : undefined,
                              isSelectable: selectableCondition.get(reference).value as boolean,
                              isSelected: true,
                              selectionType: "REFERENCE",
                              id: reference,
                              ariaLiveText: mapAriaLiveText(reference)
                          };
                      })
                    : undefined;
        }
    }, [
        enumAttribute,
        reference,
        referenceSet,
        selectableCondition,
        referenceSetValueContent,
        displayReferenceContent,
        displayTextContent,
        mapAriaLiveText,
        referenceSetValue,
        selectionType
    ]);

    // load Options
    if (selectionType !== "enumeration") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            // selectableObjects.items will automatically change when the Mendix data source is re-ran.
            if (
                !isReadOnly &&
                selectableObjects.status === ValueStatus.Available &&
                (selectionType !== "reference" || reference.status === ValueStatus.Available) &&
                (selectionType !== "referenceSet" || referenceSet.status === ValueStatus.Available)
            ) {
                setOptions(mapObjectItems(selectableObjects.items || []));
            }
        }, [selectableObjects, reference, referenceSet, isReadOnly, mapObjectItems, selectionType]);
    }

    // Determine the Filtering handling useEffect
    if (selectionType === "enumeration" && enumAttribute.universe) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            if (!isReadOnly) {
                const delayDebounceFn = setTimeout(() => {
                    if (enumAttribute.universe) {
                        if (mxFilter.trim().length > 0 && isSearchable) {
                            if (filterFunction === "contains") {
                                setOptions(
                                    mapEnum(
                                        enumAttribute.universe.filter(option =>
                                            option.toLowerCase().includes(mxFilter.trim().toLowerCase())
                                        )
                                    )
                                );
                            } else {
                                setOptions(
                                    mapEnum(
                                        enumAttribute.universe.filter(option =>
                                            option.toLowerCase().startsWith(mxFilter.trim().toLowerCase())
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
        }, [mxFilter, enumAttribute, isReadOnly]);
    } else if (filterType === "auto") {
        if (optionTextType === "text" || optionTextType === "html") {
            // text/HTML option text types ~ use displayAttribute
            if (serverSideSearching) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                React.useEffect(() => {
                    const debounce = setTimeout(() => {
                        selectableObjects.setFilter(
                            filterFunction === "contains"
                                ? contains(attribute(displayAttribute.id), literal(mxFilter.trim()))
                                : startsWith(attribute(displayAttribute.id), literal(mxFilter.trim()))
                        );
                    }, filterDelay);
                    return () => clearTimeout(debounce);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [mxFilter]);
            } else {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                React.useEffect(() => {
                    const debounce = setTimeout(() => {
                        if (mxFilter.trim().length > 0 && selectableObjects.items) {
                            setOptions(
                                mapObjectItems(
                                    selectableObjects.items.filter(item => {
                                        const text = displayAttribute.get(item).displayValue as string;
                                        return filterFunction === "contains"
                                            ? text.toLocaleLowerCase().includes(mxFilter.trim().toLocaleLowerCase())
                                            : text.toLocaleLowerCase().startsWith(mxFilter.trim().toLocaleLowerCase());
                                    })
                                )
                            );
                        } else {
                            setOptions(mapObjectItems(selectableObjects.items || []));
                        }
                    }, filterDelay);
                    return () => clearTimeout(debounce);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [mxFilter, selectableObjects]);
            }
        } else {
            // custom option text types ~ multiple search attributes
            if (serverSideSearching) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                React.useEffect(() => {
                    const debounce = setTimeout(() => {
                        const filter = searchAttributes.map(item =>
                            filterFunction === "contains"
                                ? contains(attribute(item.searchAttribute.id), literal(mxFilter.trim()))
                                : startsWith(attribute(item.searchAttribute.id), literal(mxFilter.trim()))
                        );
                        if (filter !== undefined) {
                            selectableObjects.setFilter(filter.length > 1 ? or(...filter) : filter[0]);
                        }
                    }, filterDelay);
                    return () => clearTimeout(debounce);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [mxFilter]);
            } else {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                React.useEffect(() => {
                    const debounce = setTimeout(() => {
                        if (mxFilter.trim().length > 0 && selectableObjects.items) {
                            setOptions(
                                mapObjectItems(
                                    selectableObjects.items.filter(item => {
                                        let match = false;
                                        for (const searchItem of searchAttributes) {
                                            const text = searchItem.searchAttribute.get(item).displayValue as string;
                                            match =
                                                filterFunction === "contains"
                                                    ? text
                                                          .toLocaleLowerCase()
                                                          .includes(mxFilter.trim().toLocaleLowerCase())
                                                    : text
                                                          .toLocaleLowerCase()
                                                          .startsWith(mxFilter.trim().toLocaleLowerCase());
                                            if (match) {
                                                break;
                                            }
                                        }
                                        return match;
                                    })
                                )
                            );
                        } else {
                            setOptions(mapObjectItems(selectableObjects.items || []));
                        }
                    }, filterDelay);
                    return () => clearTimeout(debounce);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [mxFilter, selectableObjects]);
            }
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
                        selectableObjects.reload();
                    }
                }, filterDelay);

                return () => clearTimeout(delayDebounceFn);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [mxFilter]);
    }

    return (
        <Fragment>
            <div id={id} className="srs" ref={srsRef}>
                <Selector
                    id={id}
                    name={name}
                    isLoading={selectableObjects && selectableObjects.status === ValueStatus.Loading}
                    loadingText={loadingText.value as string}
                    clearIcon={clearIcon?.value}
                    clearIconTitle={clearIconTitle.value as string}
                    dropdownIcon={dropdownIcon?.value}
                    isClearable={isClearable}
                    selectionType={selectionType}
                    selectStyle={selectStyle}
                    tabIndex={tabIndex}
                    selectAllIcon={selectAllIcon?.value}
                    onBadgeClick={selectedOption =>
                        onBadgeClick
                            ? callMxAction(onBadgeClick.get(selectedOption.id as ObjectItem), false)
                            : undefined
                    }
                    placeholder={placeholder.value as string}
                    isSearchable={isSearchable}
                    maxMenuHeight={maxMenuHeight.value || "15em"}
                    noResultsText={noResultsText.value as string}
                    referenceSetStyle={referenceSetStyle}
                    maxReferenceDisplay={maxReferenceDisplay}
                    showSelectAll={showSelectAll}
                    selectAllIconTitle={selectAllIconTitle.value as string}
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
                    mxFilter={mxFilter}
                    setMxFilter={setMxFilter}
                    onSelect={handleSelect}
                    onLeave={() => callMxAction(onLeave, false)}
                    srsRef={srsRef}
                    allowLoadingSelect={allowLoadingSelect}
                    clearSearchOnSelect={clearSearchOnSelect}
                    isCompact={isCompact}
                    badgeColor={badgeColor}
                />
            </div>
            {enumAttribute && enumAttribute.validation && <Alert>{enumAttribute.validation}</Alert>}
            {reference && reference.validation && <Alert>{reference.validation}</Alert>}
            {referenceSet && referenceSet.validation && <Alert>{referenceSet.validation}</Alert>}
        </Fragment>
    );
}
