import React, { createElement } from "react";
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
    onExtraClick,
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
    badgeColor,
    onEnter,
    ariaLabel
}: SearchableReferenceSelectorMxNineContainerProps): React.ReactElement {
    const defaultPageSize = React.useMemo(
        () => (selectionType !== "enumeration" && maxItems ? Number(maxItems.value) : undefined),
        [maxItems]
    );
    const [mxFilter, setMxFilter] = React.useState<string>("");
    const [itemsLimit, setItemsLimit] = React.useState<number | undefined>(defaultPageSize);
    const [options, setOptions] = React.useState<IOption[]>([]);
    const srsRef = React.useRef<HTMLDivElement>(null);
    const serverSideSearching: boolean = React.useMemo(() => {
        if (selectionType === "enumeration") {
            return false;
        }
        return optionTextType === "text" || optionTextType === "html"
            ? displayAttribute.type !== "Enum" && displayAttribute.type !== "AutoNumber" && displayAttribute.filterable
            : searchAttributes.every(
                  value =>
                      value.searchAttribute.type !== "Enum" &&
                      value.searchAttribute.type !== "AutoNumber" &&
                      value.searchAttribute.filterable
              );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isReadOnly = React.useMemo(
        (): boolean =>
            (selectionType === "reference" && reference.readOnly) ||
            (selectionType === "referenceSet" && referenceSet.readOnly) ||
            (selectionType === "enumeration" && enumAttribute.readOnly),
        [reference, referenceSet, enumAttribute, selectionType]
    );

    const hasMoreItems = React.useMemo(
        () =>
            (hasMoreResultsManual && hasMoreResultsManual.value) ||
            (((selectableObjects && selectableObjects.hasMoreItems) as boolean) && serverSideSearching),
        [hasMoreResultsManual, selectableObjects, serverSideSearching]
    );

    React.useEffect(() => {
        // Apply Max Items changes to itemsLimit
        setItemsLimit(selectionType !== "enumeration" && maxItems ? Number(maxItems.value) : undefined);
    }, [maxItems]);

    React.useEffect(() => {
        // Apply items limit to data source
        if (serverSideSearching && filterType === "auto") {
            if (itemsLimit && Number(itemsLimit) > 1) {
                selectableObjects.setLimit(itemsLimit);
            } else {
                selectableObjects.setLimit(Infinity);
            }
        }
    }, [itemsLimit]);

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

    const displayTextContent = React.useCallback((text: string): React.ReactNode => <span>{text}</span>, []);

    const displayReferenceContent = React.useCallback(
        (displayObj: ObjectItem): React.ReactNode =>
            optionTextType === "text" ? (
                <span>{displayAttribute.get(displayObj).displayValue}</span>
            ) : optionTextType === "html" ? (
                <span
                    dangerouslySetInnerHTML={{
                        __html: `${displayAttribute.get(displayObj).displayValue?.toString()}`
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
            enumArray.map(value => ({
                content: displayTextContent(enumAttribute.formatter.format(value)),
                isSelectable: true,
                isSelected: value === (enumAttribute.value as string),
                selectionType: "ENUMERATION",
                id: value,
                ariaLiveText: enumAttribute.formatter.format(value)
            })),
        [enumAttribute, displayTextContent]
    );

    const mapAriaLiveText = React.useCallback(
        (objectItem: ObjectItem): string =>
            ariaLiveText
                ? (ariaLiveText.get(objectItem).value as string)
                : displayAttribute
                ? (displayAttribute.get(objectItem).displayValue as string)
                : optionExpression
                ? (optionExpression.get(objectItem).value as string)
                : "",
        [ariaLiveText, displayAttribute, optionExpression]
    );

    const mapObjectItems = React.useCallback(
        (objectItems: ObjectItem[]): IOption[] =>
            objectItems.map(objItem => ({
                content: displayReferenceContent(objItem),
                isSelectable: selectableCondition.get(objItem).value as boolean,
                isSelected:
                    selectionType === "referenceSet"
                        ? referenceSet.value?.find(option => option.id === objItem.id) !== undefined
                        : reference.value?.id === objItem.id,

                selectionType: "REFERENCE",
                id: objItem,
                ariaLiveText: mapAriaLiveText(objItem)
            })),
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

    const currentValue: IOption | IOption[] | undefined = React.useMemo(() => {
        switch (selectionType) {
            case "enumeration":
                return enumAttribute.status === ValueStatus.Available && enumAttribute.value !== undefined
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
                    ? referenceSet.value.map(reference => ({
                          content: displayReferenceContent(reference),
                          badgeContent:
                              referenceSetValue === "CUSTOM" ? referenceSetValueContent.get(reference) : undefined,
                          isSelectable: selectableCondition.get(reference).value as boolean,
                          isSelected: true,
                          selectionType: "REFERENCE",
                          id: reference,
                          ariaLiveText: mapAriaLiveText(reference)
                      }))
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

    // load Options ~ handle if the selected value changed outside the widget
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
    } else {
        React.useEffect(() => {
            if (!isReadOnly && enumAttribute.status === ValueStatus.Available && enumAttribute.universe) {
                setOptions(mapEnum(enumAttribute.universe));
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [enumAttribute, isReadOnly]);
    }

    // Determine the Filtering handling useEffect
    if (selectionType === "enumeration") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            if (!isReadOnly) {
                const delayDebounceFn = setTimeout(() => {
                    if (enumAttribute.universe) {
                        if (mxFilter.trim().length > 0 && isSearchable) {
                            const searchText = mxFilter.trim().toLowerCase();
                            setOptions(
                                mapEnum(
                                    filterFunction === "contains"
                                        ? enumAttribute.universe.filter(option =>
                                              enumAttribute.formatter.format(option).toLowerCase().includes(searchText)
                                          )
                                        : enumAttribute.universe.filter(option =>
                                              enumAttribute.formatter
                                                  .format(option)
                                                  .toLowerCase()
                                                  .startsWith(searchText)
                                          )
                                )
                            );
                        } else {
                            setOptions(mapEnum(enumAttribute.universe));
                        }
                    }
                }, filterDelay);

                return () => clearTimeout(delayDebounceFn);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [mxFilter, isReadOnly]);
    } else if (filterType === "auto") {
        if (optionTextType === "text" || optionTextType === "html") {
            // text/HTML option text types ~ use displayAttribute
            if (serverSideSearching) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                React.useEffect(() => {
                    if (!isReadOnly) {
                        const debounce = setTimeout(() => {
                            selectableObjects.setFilter(
                                filterFunction === "contains"
                                    ? contains(attribute(displayAttribute.id), literal(mxFilter.trim()))
                                    : startsWith(attribute(displayAttribute.id), literal(mxFilter.trim()))
                            );
                        }, filterDelay);
                        return () => clearTimeout(debounce);
                    }
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [mxFilter, isReadOnly]);
            } else {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                React.useEffect(() => {
                    if (!isReadOnly) {
                        const debounce = setTimeout(() => {
                            if (mxFilter.trim().length > 0 && selectableObjects.items) {
                                setOptions(
                                    mapObjectItems(
                                        selectableObjects.items.filter(item => {
                                            const text = displayAttribute.get(item).displayValue as string;
                                            return filterFunction === "contains"
                                                ? text.toLocaleLowerCase().includes(mxFilter.trim().toLocaleLowerCase())
                                                : text
                                                      .toLocaleLowerCase()
                                                      .startsWith(mxFilter.trim().toLocaleLowerCase());
                                        })
                                    )
                                );
                            } else {
                                setOptions(mapObjectItems(selectableObjects.items || []));
                            }
                        }, filterDelay);
                        return () => clearTimeout(debounce);
                    }
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [mxFilter, selectableObjects, isReadOnly]);
            }
        } else {
            // custom option text types ~ multiple search attributes
            if (serverSideSearching) {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                React.useEffect(() => {
                    if (!isReadOnly) {
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
                    }
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [mxFilter, isReadOnly]);
            } else {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                React.useEffect(() => {
                    if (!isReadOnly) {
                        const debounce = setTimeout(() => {
                            if (mxFilter.trim().length > 0 && selectableObjects.items) {
                                setOptions(
                                    mapObjectItems(
                                        selectableObjects.items.filter(item => {
                                            let match = false;
                                            for (const searchItem of searchAttributes) {
                                                const text = searchItem.searchAttribute.get(item)
                                                    .displayValue as string;
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
                    }
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }, [mxFilter, selectableObjects, isReadOnly]);
            }
        }
    } else {
        // filter type manual, dev is expected to make filter logic inside their data source Microflow
        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            if (searchText.status === ValueStatus.Available && searchText.displayValue !== mxFilter) {
                setMxFilter(searchText.displayValue);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [searchText]);

        // eslint-disable-next-line react-hooks/rules-of-hooks
        React.useEffect(() => {
            if (searchText.status === ValueStatus.Available && !isReadOnly) {
                const delayDebounceFn = setTimeout(() => {
                    if (isSearchable) {
                        searchText.setValue(mxFilter);
                        selectableObjects.reload();
                    }
                }, filterDelay);

                return () => clearTimeout(delayDebounceFn);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [mxFilter, isReadOnly]);
    }

    return (
        <React.Fragment>
            <div id={id} className="srs" ref={srsRef}>
                <Selector
                    id={id}
                    name={name}
                    ariaLabel={ariaLabel?.value}
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
                    onBadgeClick={
                        onBadgeClick
                            ? selectedOption => callMxAction(onBadgeClick.get(selectedOption.id as ObjectItem), false)
                            : undefined
                    }
                    onExtraClick={onExtraClick ? () => callMxAction(onExtraClick, true) : undefined}
                    placeholder={placeholder.value as string}
                    isSearchable={isSearchable}
                    maxMenuHeight={maxMenuHeight?.value}
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
                    onEnter={() => callMxAction(onEnter, true)}
                />
            </div>
            {enumAttribute && enumAttribute.validation && <Alert>{enumAttribute.validation}</Alert>}
            {reference && reference.validation && <Alert>{reference.validation}</Alert>}
            {referenceSet && referenceSet.validation && <Alert>{referenceSet.validation}</Alert>}
        </React.Fragment>
    );
}
