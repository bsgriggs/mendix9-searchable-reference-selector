import { createElement, useState, useEffect, ReactElement } from "react";
import { SearchableReferenceSelectorMxNineContainerProps } from "../typings/SearchableReferenceSelectorMxNineProps";
import { ObjectItem, ValueStatus } from "mendix";
import { attribute, literal, contains } from "mendix/filters/builders";
import "./ui/SearchableReferenceSelectorMxNine.css";
import { Alert } from "./components/Alert";
import ReferenceDropdown from "./components/ReferenceDropdown";
import ReferenceSetDropdown from "./components/ReferenceSetDropdown";
import LoadingSelector from "./components/LoadingSelector";
import ReferenceList from "./components/ReferenceList";
import ReferenceSetList from "./components/ReferenceSetList";

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
    const [currentObjectItem, setCurrentObjectItem] = useState<ObjectItem | ObjectItem[] | undefined>();
    const [options, setOptions] = useState<ObjectItem[]>([]);

    if (Number(maxItems.value) > 1 && displayAttribute.type === "String") {
        selectableObjects.setLimit(Number(maxItems.value));
    }

    useEffect(() => {
        setCurrentObjectItem(association.value as ObjectItem);
    }, [association.value]);

    useEffect(() => {
        setOptions(selectableObjects.items || []);
    }, [selectableObjects]);

    useEffect(() => {
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
                                return text !== undefined && text.toLowerCase().includes(mxFilter.trim().toLowerCase());
                            })
                        );
                    } else {
                        setOptions(selectableObjects.items || []);
                    }
                }
            }
        }, filterDelay);

        return () => clearTimeout(delayDebounceFn);
    }, [mxFilter, displayAttribute, filterDelay, isSearchable, selectableObjects]);

    if (
        association.status === ValueStatus.Available &&
        selectableObjects.status === ValueStatus.Available &&
        placeholder.status === ValueStatus.Available &&
        maxMenuHeight.status === ValueStatus.Available
    ) {
        const onSelectReferenceHandler = (selectedObj: (ObjectItem & ObjectItem[]) | undefined): void => {
            // update Mendix object
            association.setValue(selectedObj);
            setCurrentObjectItem(selectedObj);
            // run on change
            if (
                currentObjectItem !== selectedObj &&
                onChangeAssociation !== undefined &&
                onChangeAssociation.canExecute
            ) {
                onChangeAssociation.execute();
            }
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
                    />
                )}
                {association.validation && <Alert>{association.validation}</Alert>}
            </div>
        );
    } else {
        return (
            <LoadingSelector
                name={name}
                tabIndex={tabIndex}
                placeholder={placeholder.value}
                isClearable={isClearable}
                clearIcon={clearIcon}
                dropdownIcon={dropdownIcon}
            />
        );
    }
};

export default SearchableReferenceSelector;
