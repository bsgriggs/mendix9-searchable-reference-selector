import {
    createElement,
    ReactElement,
    useMemo,
    useState,
    useEffect,
    useCallback,
    ReactNode,
    useRef,
    Fragment
} from "react";
import { SearchableReferenceSelectorMxNineContainerProps } from "../typings/SearchableReferenceSelectorMxNineProps";
import { ObjectItem, ValueStatus, ActionValue } from "mendix";
import { attribute, literal, contains, startsWith, or } from "mendix/filters/builders";
import Selector from "./components/Selector";
import { IOption } from "../typings/option";
import "./ui/SearchableReferenceSelectorMxNine.scss";
import { Alert } from "./components/Alert";

export default function SearchableReferenceSelector(
    props: SearchableReferenceSelectorMxNineContainerProps
): ReactElement {
    const defaultPageSize = useMemo(
        () =>
            props.selectionType !== "enumeration" && props.selectionType !== "boolean" && props.maxItems
                ? Number(props.maxItems.value)
                : Infinity,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.maxItems]
    );
    const [mxFilter, setMxFilter] = useState<string>("");
    const [itemsLimit, setItemsLimit] = useState<number>(defaultPageSize);
    const [options, setOptions] = useState<IOption[]>([]);
    const [skipFilter, setSkipFilter] = useState<boolean>(true);
    const srsRef = useRef<HTMLDivElement>(null);
    const serverSideSearching: boolean = useMemo(() => {
        if (props.selectionType === "enumeration" || props.selectionType === "boolean" || props.forceClientSide) {
            return false;
        }
        return props.optionTextType === "text" || props.optionTextType === "html"
            ? props.displayAttribute.type !== "Enum" &&
                  props.displayAttribute.type !== "AutoNumber" &&
                  props.displayAttribute.filterable
            : props.searchAttributes.every(
                  value =>
                      value.searchAttribute.type !== "Enum" &&
                      value.searchAttribute.type !== "AutoNumber" &&
                      value.searchAttribute.filterable
              );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isReadOnly = useMemo(
        (): boolean =>
            (props.selectionType === "reference" && props.reference.readOnly) ||
            (props.selectionType === "referenceSet" && props.referenceSet.readOnly) ||
            (props.selectionType === "enumeration" && props.enumAttribute.readOnly) ||
            (props.selectionType === "boolean" && props.booleanAttribute.readOnly),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.reference, props.referenceSet, props.enumAttribute, props.booleanAttribute]
    );

    const hasMoreItems = useMemo(
        () =>
            (props.hasMoreResultsManual && props.hasMoreResultsManual.value) ||
            (((props.selectableObjects && props.selectableObjects.hasMoreItems) as boolean) && serverSideSearching),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.hasMoreResultsManual, props.selectableObjects]
    );

    // Apply Max Items changes to itemsLimit
    useEffect(() => {
        setItemsLimit(serverSideSearching && props.maxItems ? Number(props.maxItems.value) : Infinity);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.maxItems]);

    // Apply items limit to data source
    useEffect(() => {
        if (props.filterType === "auto" && props.selectableObjects) {
            if (isReadOnly) {
                props.selectableObjects.setLimit(0);
            } else {
                props.selectableObjects.setLimit(itemsLimit && Number(itemsLimit) > 1 ? itemsLimit : Infinity);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsLimit, isReadOnly]);

    const handleSelect = useCallback(
        (selectedOption: IOption | IOption[] | undefined): void => {
            if (!isReadOnly) {
                if (Array.isArray(selectedOption)) {
                    props.referenceSet.setValue(selectedOption.map(option => option.id as ObjectItem));
                } else if (props.selectionType === "enumeration") {
                    props.enumAttribute.setValue(selectedOption?.id as string);
                } else if (props.selectionType === "boolean") {
                    props.booleanAttribute.setValue(selectedOption?.id as boolean);
                } else {
                    props.reference.setValue(selectedOption?.id as ObjectItem);
                }
                callMxAction(props.onChange, false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isReadOnly, props.enumAttribute, props.reference, props.referenceSet, props.onChange, props.booleanAttribute]
    );

    const displayTextContent = useCallback((text: string): ReactNode => <span>{text}</span>, []);

    const displayReferenceContent = useCallback(
        (displayObj: ObjectItem): ReactNode =>
            props.optionTextType === "text" ? (
                <span>{props.displayAttribute.get(displayObj).displayValue}</span>
            ) : props.optionTextType === "html" ? (
                <span
                    dangerouslySetInnerHTML={{
                        __html: `${props.displayAttribute.get(displayObj).displayValue?.toString()}`
                    }}
                ></span>
            ) : props.optionTextType === "expression" ? (
                <span>{props.optionExpression.get(displayObj).value}</span>
            ) : (
                <span>{props.optionCustomContent.get(displayObj)}</span>
            ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.optionTextType, props.optionCustomContent, props.displayAttribute, props.optionExpression]
    );

    const mapEnum = useCallback(
        (enumArray: string[]): IOption[] =>
            enumArray.map(value => ({
                content: displayTextContent(props.enumAttribute.formatter.format(value)),
                isSelectable: true,
                isSelected: value === (props.enumAttribute.value as string),
                selectionType: "ENUMERATION",
                id: value,
                ariaLiveText: props.enumAttribute.formatter.format(value)
            })),
        [props.enumAttribute, displayTextContent]
    );

    const boolOptions: IOption[] = useMemo(
        () =>
            props.selectionType === "boolean"
                ? [
                      {
                          content: displayTextContent(props.trueLabel.value as string),
                          isSelectable: true,
                          isSelected: props.booleanAttribute.value === true,
                          selectionType: "BOOLEAN",
                          id: true,
                          ariaLiveText: props.trueLabel.value as string
                      },
                      {
                          content: displayTextContent(props.falseLabel.value as string),
                          isSelectable: true,
                          isSelected: props.booleanAttribute.value === false,
                          selectionType: "BOOLEAN",
                          id: false,
                          ariaLiveText: props.falseLabel.value as string
                      }
                  ]
                : [],
        [props.trueLabel, props.falseLabel, props.booleanAttribute]
    );

    const mapAriaLiveText = useCallback(
        (objectItem: ObjectItem): string =>
            props.ariaLiveText
                ? (props.ariaLiveText.get(objectItem).value as string)
                : props.displayAttribute
                ? (props.displayAttribute.get(objectItem).displayValue as string)
                : props.optionExpression
                ? (props.optionExpression.get(objectItem).value as string)
                : "",
        [props.ariaLiveText, props.displayAttribute, props.optionExpression]
    );

    const mapObjectItems = useCallback(
        (objectItems: ObjectItem[]): IOption[] =>
            objectItems.map(objItem => ({
                content: displayReferenceContent(objItem),
                isSelectable: props.selectableCondition.get(objItem).value as boolean,
                isSelected:
                    props.selectionType === "referenceSet"
                        ? props.referenceSet.value?.find(option => option.id === objItem.id) !== undefined
                        : props.reference.value?.id === objItem.id,

                selectionType: "REFERENCE",
                id: objItem,
                ariaLiveText: mapAriaLiveText(objItem)
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.reference, props.referenceSet, props.selectableCondition, displayReferenceContent, mapAriaLiveText]
    );

    const onShowMore = (newLimit: number | undefined, onClickMoreResultsText: ActionValue | undefined): void => {
        if (props.filterType === "auto" && newLimit) {
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
        switch (props.selectionType) {
            case "enumeration":
                return props.enumAttribute.status === ValueStatus.Available && props.enumAttribute.value !== undefined
                    ? {
                          content: displayTextContent(props.enumAttribute.displayValue),
                          isSelectable: true,
                          isSelected: true,
                          selectionType: "ENUMERATION",
                          id: props.enumAttribute.value,
                          ariaLiveText: props.enumAttribute.displayValue
                      }
                    : undefined;
            case "boolean":
                const booleanText = (
                    props.booleanAttribute.value === true ? props.trueLabel.value : props.falseLabel.value
                ) as string;
                return props.booleanAttribute.status === ValueStatus.Available
                    ? {
                          content: displayTextContent(booleanText),
                          isSelectable: true,
                          isSelected: true,
                          selectionType: "BOOLEAN",
                          id: props.booleanAttribute.value as boolean,
                          ariaLiveText: booleanText
                      }
                    : undefined;
            case "reference":
                return props.reference.value !== undefined && props.reference.status === ValueStatus.Available
                    ? {
                          content: displayReferenceContent(props.reference.value),
                          isSelectable: props.selectableCondition.get(props.reference.value).value as boolean,
                          isSelected: true,
                          selectionType: "REFERENCE",
                          id: props.reference.value,
                          ariaLiveText: mapAriaLiveText(props.reference.value)
                      }
                    : undefined;
            case "referenceSet":
                return props.referenceSet.value !== undefined && props.referenceSet.status === ValueStatus.Available
                    ? props.referenceSet.value.map(reference => ({
                          content: displayReferenceContent(reference),
                          badgeContent:
                              props.referenceSetValue === "CUSTOM"
                                  ? props.referenceSetValueContent.get(reference)
                                  : undefined,
                          isSelectable: props.selectableCondition.get(reference).value as boolean,
                          isSelected: true,
                          selectionType: "REFERENCE",
                          id: reference,
                          ariaLiveText: mapAriaLiveText(reference)
                      }))
                    : undefined;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        props.enumAttribute,
        props.reference,
        props.referenceSet,
        props.selectableCondition,
        props.referenceSetValueContent,
        displayReferenceContent,
        displayTextContent,
        mapAriaLiveText,
        props.referenceSetValue,
        props.booleanAttribute,
        props.trueLabel,
        props.falseLabel
    ]);

    // load Options ~ handle if the selected value changed outside the widget
    useEffect(() => {
        if (!isReadOnly) {
            if (props.selectionType === "enumeration") {
                if (props.enumAttribute.status === ValueStatus.Available) {
                    setOptions(mapEnum(props.enumAttribute.universe || []));
                }
            } else if (props.selectionType === "boolean") {
                if (props.booleanAttribute.status === ValueStatus.Available) {
                    setOptions(boolOptions);
                }
            } else if (
                props.selectableObjects.status === ValueStatus.Available &&
                (props.selectionType !== "reference" || props.reference.status === ValueStatus.Available) &&
                (props.selectionType !== "referenceSet" || props.referenceSet.status === ValueStatus.Available)
            ) {
                setOptions(mapObjectItems(props.selectableObjects.items || []));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        props.selectableObjects,
        props.reference,
        props.referenceSet,
        props.enumAttribute,
        isReadOnly,
        props.booleanAttribute,
        boolOptions,
        props.selectableCondition
    ]);

    // Apply the Filtering useEffect
    useEffect(() => {
        if (!isReadOnly && !skipFilter) {
            if (props.filterType === "auto") {
                if (props.selectionType === "enumeration") {
                    const enumFilterDebounce = setTimeout(() => {
                        if (props.enumAttribute.universe) {
                            if (mxFilter.trim().length > 0 && props.isSearchable) {
                                const searchText = mxFilter.trim().toLowerCase();
                                setOptions(
                                    mapEnum(
                                        props.filterFunction === "contains"
                                            ? props.enumAttribute.universe.filter(option =>
                                                  props.enumAttribute.formatter
                                                      .format(option)
                                                      .toLowerCase()
                                                      .includes(searchText)
                                              )
                                            : props.enumAttribute.universe.filter(option =>
                                                  props.enumAttribute.formatter
                                                      .format(option)
                                                      .toLowerCase()
                                                      .startsWith(searchText)
                                              )
                                    )
                                );
                            } else {
                                setOptions(mapEnum(props.enumAttribute.universe));
                            }
                        }
                    }, props.filterDelay);

                    return () => clearTimeout(enumFilterDebounce);
                } else if (props.selectionType === "boolean") {
                    const booleanFilterDebounce = setTimeout(() => {
                        if (mxFilter.trim().length > 0 && props.isSearchable) {
                            const searchText = mxFilter.trim().toLowerCase();
                            setOptions(
                                props.filterFunction === "contains"
                                    ? boolOptions.filter(option =>
                                          option.ariaLiveText?.toLowerCase().includes(searchText)
                                      )
                                    : boolOptions.filter(option =>
                                          option.ariaLiveText?.toLowerCase().startsWith(searchText)
                                      )
                            );
                        } else {
                            setOptions(boolOptions);
                        }
                    }, props.filterDelay);

                    return () => clearTimeout(booleanFilterDebounce);
                } else if (props.optionTextType === "text" || props.optionTextType === "html") {
                    if (serverSideSearching) {
                        const singleServerSideDebounce = setTimeout(() => {
                            props.selectableObjects.setFilter(
                                props.filterFunction === "contains"
                                    ? contains(attribute(props.displayAttribute.id), literal(mxFilter.trim()))
                                    : startsWith(attribute(props.displayAttribute.id), literal(mxFilter.trim()))
                            );
                        }, props.filterDelay);
                        return () => clearTimeout(singleServerSideDebounce);
                    } else {
                        const singleClientSideDebounce = setTimeout(() => {
                            if (mxFilter.trim().length > 0 && props.selectableObjects.items) {
                                setOptions(
                                    mapObjectItems(
                                        props.selectableObjects.items.filter(item => {
                                            const text = props.displayAttribute.get(item).displayValue as string;
                                            return props.filterFunction === "contains"
                                                ? text.toLocaleLowerCase().includes(mxFilter.trim().toLocaleLowerCase())
                                                : text
                                                      .toLocaleLowerCase()
                                                      .startsWith(mxFilter.trim().toLocaleLowerCase());
                                        })
                                    )
                                );
                            } else {
                                setOptions(mapObjectItems(props.selectableObjects.items || []));
                            }
                        }, props.filterDelay);
                        return () => clearTimeout(singleClientSideDebounce);
                    }
                } else {
                    if (serverSideSearching) {
                        const multiServerSideDebounce = setTimeout(() => {
                            const filter = props.searchAttributes.map(item =>
                                props.filterFunction === "contains"
                                    ? contains(attribute(item.searchAttribute.id), literal(mxFilter.trim()))
                                    : startsWith(attribute(item.searchAttribute.id), literal(mxFilter.trim()))
                            );
                            if (filter !== undefined) {
                                props.selectableObjects.setFilter(filter.length > 1 ? or(...filter) : filter[0]);
                            }
                        }, props.filterDelay);
                        return () => clearTimeout(multiServerSideDebounce);
                    } else {
                        const multiClientSideDebounce = setTimeout(() => {
                            if (mxFilter.trim().length > 0 && props.selectableObjects.items) {
                                setOptions(
                                    mapObjectItems(
                                        props.selectableObjects.items.filter(item => {
                                            let match = false;
                                            for (const searchItem of props.searchAttributes) {
                                                const text = searchItem.searchAttribute.get(item)
                                                    .displayValue as string;
                                                match =
                                                    props.filterFunction === "contains"
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
                                setOptions(mapObjectItems(props.selectableObjects.items || []));
                            }
                        }, props.filterDelay);
                        return () => clearTimeout(multiClientSideDebounce);
                    }
                }
            } else {
                // Manual mode -> update searchText attribute
                if (props.searchText.status === ValueStatus.Available && !isReadOnly) {
                    const manualFilterDebounce = setTimeout(() => {
                        if (props.isSearchable) {
                            props.searchText.setValue(mxFilter);
                            props.selectableObjects.reload();
                        }
                    }, props.filterDelay);

                    return () => clearTimeout(manualFilterDebounce);
                }
            }
        }
        if (!isReadOnly && skipFilter) {
            setSkipFilter(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mxFilter, isReadOnly, boolOptions]);

    // filter type manual, dev is expected to make filter logic inside their data source Microflow using the search text
    if (props.filterType === "manual") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            if (props.searchText.status === ValueStatus.Available && props.searchText.displayValue !== mxFilter) {
                setMxFilter(props.searchText.displayValue);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.searchText]);
    }

    return (
        <Fragment>
            <div id={props.id} className="srs" ref={srsRef}>
                <Selector
                    {...props}
                    ariaLabel={props.ariaLabel?.value}
                    isLoading={props.selectableObjects && props.selectableObjects.status === ValueStatus.Loading}
                    loadingText={props.loadingText.value as string}
                    isClearable={props.selectionType !== "boolean" ? props.isClearable : false}
                    clearIcon={props.clearIcon?.value}
                    clearIconTitle={props.clearIconTitle.value as string}
                    dropdownIcon={props.dropdownIcon?.value}
                    selectAllIcon={props.selectAllIcon?.value}
                    onBadgeClick={
                        props.onBadgeClick
                            ? selectedOption =>
                                  callMxAction(props.onBadgeClick?.get(selectedOption.id as ObjectItem), false)
                            : undefined
                    }
                    onExtraClick={props.onExtraClick ? () => callMxAction(props.onExtraClick, true) : undefined}
                    placeholder={props.placeholder.value as string}
                    maxMenuHeight={props.maxMenuHeight?.value}
                    noResultsText={props.noResultsText.value as string}
                    selectAllIconTitle={props.selectAllIconTitle.value as string}
                    hasMoreOptions={hasMoreItems}
                    moreResultsText={hasMoreItems ? props.moreResultsText.value : undefined}
                    onSelectMoreOptions={
                        hasMoreItems
                            ? () => onShowMore(itemsLimit + defaultPageSize, props.onClickMoreResultsText)
                            : undefined
                    }
                    currentValue={currentValue}
                    isReadOnly={isReadOnly}
                    options={options}
                    optionsStyle={
                        props.selectionType === "referenceSet" ? props.optionsStyleSet : props.optionsStyleSingle
                    }
                    mxFilter={mxFilter}
                    setMxFilter={setMxFilter}
                    onSelect={handleSelect}
                    onLeave={() => callMxAction(props.onLeave, false)}
                    srsRef={srsRef}
                    onEnter={() => callMxAction(props.onEnter, true)}
                />
            </div>
            {props.enumAttribute && props.enumAttribute.validation && <Alert>{props.enumAttribute.validation}</Alert>}
            {props.booleanAttribute && props.booleanAttribute.validation && (
                <Alert>{props.booleanAttribute.validation}</Alert>
            )}
            {props.reference && props.reference.validation && <Alert>{props.reference.validation}</Alert>}
            {props.referenceSet && props.referenceSet.validation && <Alert>{props.referenceSet.validation}</Alert>}
        </Fragment>
    );
}
