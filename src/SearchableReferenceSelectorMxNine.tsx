import { createElement, useState, useEffect, ReactElement } from "react";
import { SearchableReferenceSelectorMxNineContainerProps } from "../typings/SearchableReferenceSelectorMxNineProps";
import { ObjectItem, ValueStatus, ActionValue } from "mendix";
import { attribute, literal, contains } from "mendix/filters/builders";
import "./ui/SearchableReferenceSelectorMxNine.css";
import { Alert } from "./components/Alert";
import ReferenceDropdown from "./components/ReferenceDropdown";
import ReferenceSetDropdown from "./components/ReferenceSetDropdown";
import ReferenceList from "./components/ReferenceList";
import ReferenceSetList from "./components/ReferenceSetList";

const callMxAction = (action?: ActionValue): void => {
    if (action !== undefined && action.canExecute && action.isExecuting === false) {
        action.execute();
    }
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
    optionsStyle,
    placeholder,
    referenceSetStyle,
    selectStyle,
    showSelectAll,
    clearIcon,
    dropdownIcon,
    onBadgeClick,
    onChangeAssociation,
    optionCustomContent,
    selectAllIcon,
    selectableAttribute,
    tabIndex,
    selectableObjects
}: SearchableReferenceSelectorMxNineContainerProps): ReactElement => {
    const [mxFilter, setMxFilter] = useState<string>("");
    const [options, setOptions] = useState<ObjectItem[]>();
    // const [isLoading, setIsLoading] = useState<boolean>(true);

    // const isLoading =
    //     association.status !== ValueStatus.Available ||
    //     selectableObjects.status !== ValueStatus.Available ||
    //     placeholder.status !== ValueStatus.Available ||
    //     maxMenuHeight.status !== ValueStatus.Available;

    // console.info("rendered", { options, ...selectableObjects });

    if (Number(maxItems.value) > 1) {
        selectableObjects.setLimit(Number(maxItems.value));
    }

    // load objects
    useEffect(() => {
        if (selectableObjects.status === ValueStatus.Available) {
            setOptions(selectableObjects.items || []);
        }
    }, [selectableObjects]);

    // apply filter
    useEffect(() => {
        if (selectableObjects.status === ValueStatus.Available) {
            const delayDebounceFn = setTimeout(() => {
                if (isSearchable) {
                    if (displayAttribute.filterable && displayAttribute.type === "String") {
                        // data source supports xpath filtering
                        const filterCondition = contains(attribute(displayAttribute.id), literal(mxFilter));
                        selectableObjects.setFilter(filterCondition);
                    } else {
                        // data source does not support xpath filter - filter on client
                        if (mxFilter.trim().length > 0 && selectableObjects.items) {
                            setOptions(
                                selectableObjects.items.filter(obj => {
                                    const text = displayAttribute.get(obj).displayValue as string;
                                    return (
                                        text !== undefined && text.toLowerCase().includes(mxFilter.trim().toLowerCase())
                                    );
                                })
                            );
                        } else {
                            setOptions(selectableObjects.items || []);
                        }
                    }
                }
            }, filterDelay);

            return () => clearTimeout(delayDebounceFn);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mxFilter]);

    const onSelectReferenceHandler = (selectedObj: (ObjectItem & ObjectItem[]) | undefined): void => {
        // update Mendix object
        association.setValue(selectedObj);
        // run on change
        callMxAction(onChangeAssociation);
    };

    return (
        <div id={id} className="srs">
            {association.type === "Reference" && selectStyle === "dropdown" && (
                <ReferenceDropdown
                    name={name}
                    tabIndex={tabIndex}
                    currentValue={association.value as ObjectItem}
                    isClearable={isClearable}
                    clearIcon={clearIcon}
                    dropdownIcon={dropdownIcon}
                    onSelectAssociation={(newAssociation: ObjectItem | undefined) =>
                        onSelectReferenceHandler(newAssociation as ObjectItem & ObjectItem[])
                    }
                    selectableObjects={options}
                    placeholder={placeholder.value}
                    isReadOnly={association.readOnly}
                    isSearchable={isSearchable}
                    maxHeight={maxMenuHeight.value}
                    noResultsText={noResultsText.value}
                    displayAttribute={displayAttribute}
                    optionTextType={optionTextType}
                    selectableAttribute={selectableAttribute}
                    optionCustomContent={optionCustomContent}
                    mxFilter={mxFilter}
                    setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                    moreResultsText={selectableObjects.hasMoreItems ? moreResultsText.value : undefined}
                    optionsStyle={optionsStyle}
                    // isLoading={isLoading}
                />
            )}
            {association.type === "Reference" && selectStyle === "list" && (
                <ReferenceList
                    name={name}
                    tabIndex={tabIndex}
                    currentValue={association.value as ObjectItem}
                    isClearable={isClearable}
                    clearIcon={clearIcon}
                    onSelectAssociation={(newAssociation: ObjectItem | undefined) =>
                        onSelectReferenceHandler(newAssociation as ObjectItem & ObjectItem[])
                    }
                    selectableObjects={options}
                    placeholder={placeholder.value}
                    isReadOnly={association.readOnly}
                    noResultsText={noResultsText.value}
                    displayAttribute={displayAttribute}
                    optionTextType={optionTextType}
                    selectableAttribute={selectableAttribute}
                    optionCustomContent={optionCustomContent}
                    mxFilter={mxFilter}
                    setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                    moreResultsText={selectableObjects.hasMoreItems ? moreResultsText.value : undefined}
                    optionsStyle={optionsStyle}
                    isSearchable={isSearchable}
                    // isLoading={isLoading}
                />
            )}
            {association.type === "ReferenceSet" && selectStyle === "dropdown" && (
                <ReferenceSetDropdown
                    name={name}
                    tabIndex={tabIndex}
                    currentValues={association.value as ObjectItem[]}
                    isClearable={isClearable}
                    clearIcon={clearIcon}
                    dropdownIcon={dropdownIcon}
                    onSelectAssociation={(newAssociation: ObjectItem[] | undefined) =>
                        onSelectReferenceHandler(newAssociation as ObjectItem & ObjectItem[])
                    }
                    selectableObjects={options}
                    placeholder={placeholder.value}
                    isReadOnly={association.readOnly}
                    isSearchable={isSearchable}
                    maxHeight={maxMenuHeight.value}
                    noResultsText={noResultsText.value}
                    displayAttribute={displayAttribute}
                    optionTextType={optionTextType}
                    selectableAttribute={selectableAttribute}
                    optionCustomContent={optionCustomContent}
                    mxFilter={mxFilter}
                    setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                    moreResultsText={selectableObjects.hasMoreItems ? moreResultsText.value : undefined}
                    optionsStyle={optionsStyle}
                    referenceSetStyle={referenceSetStyle}
                    maxReferenceDisplay={maxReferenceDisplay}
                    showSelectAll={showSelectAll}
                    selectAllIcon={selectAllIcon}
                    onBadgeClick={onBadgeClick}
                    // isLoading={isLoading}
                />
            )}
            {association.type === "ReferenceSet" && selectStyle === "list" && (
                <ReferenceSetList
                    name={name}
                    tabIndex={tabIndex}
                    currentValues={association.value as ObjectItem[]}
                    isClearable={isClearable}
                    clearIcon={clearIcon}
                    onSelectAssociation={(newAssociation: ObjectItem[] | undefined) =>
                        onSelectReferenceHandler(newAssociation as ObjectItem & ObjectItem[])
                    }
                    selectableObjects={options}
                    placeholder={placeholder.value}
                    isReadOnly={association.readOnly}
                    noResultsText={noResultsText.value}
                    displayAttribute={displayAttribute}
                    optionTextType={optionTextType}
                    selectableAttribute={selectableAttribute}
                    optionCustomContent={optionCustomContent}
                    mxFilter={mxFilter}
                    setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                    moreResultsText={selectableObjects.hasMoreItems ? moreResultsText.value : undefined}
                    optionsStyle={optionsStyle}
                    isSearchable={isSearchable}
                    showSelectAll={showSelectAll}
                    selectAllIcon={selectAllIcon}
                    maxReferenceDisplay={maxReferenceDisplay}
                    referenceSetStyle={referenceSetStyle}
                    // isLoading={isLoading}
                />
            )}
            {association.validation && <Alert>{association.validation}</Alert>}
        </div>
    );
};

export default SearchableReferenceSelector;
