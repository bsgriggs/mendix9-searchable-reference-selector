import { createElement, useState, useEffect } from "react";
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

const SearchableReferenceSelector = (props: SearchableReferenceSelectorMxNineContainerProps): JSX.Element => {
    const [mxFilter, setMxFilter] = useState<string>("");
    const [currentObjectItem, setCurrentObjectItem] = useState<ObjectItem | ObjectItem[] | undefined>();
    if (Number(props.maxItems.value) > 1) {
        props.selectableObjects.setLimit(Number(props.maxItems.value));
    }
    useEffect(() => {
        setCurrentObjectItem(props.association.value as ObjectItem);
    }, [props.association.value]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (props.displayAttribute.filterable) {
                const filterCondition = contains(attribute(props.displayAttribute.id), literal(mxFilter));
                props.selectableObjects.setFilter(filterCondition);
            } else {
                console.log("Attribute is not filterable");
            }
        }, props.filterDelay);

        return () => clearTimeout(delayDebounceFn);
    }, [mxFilter]);

    if (
        props.association.status === ValueStatus.Available &&
        props.selectableObjects.status === ValueStatus.Available &&
        props.placeholder.status === ValueStatus.Available &&
        props.maxMenuHeight.status === ValueStatus.Available
    ) {
        const onSelectReferenceHandler = (selectedObj: (ObjectItem & ObjectItem[]) | undefined): void => {
            // update Mendix object
            props.association.setValue(selectedObj);
            setCurrentObjectItem(selectedObj);
            // run on change
            if (
                currentObjectItem !== selectedObj &&
                props.onChangeAssociation !== undefined &&
                props.onChangeAssociation.canExecute
            ) {
                props.onChangeAssociation.execute();
            }
        };

        return (
            <div id={props.id} className="srs">
                {props.association.type === "Reference" && props.selectStyle === "dropdown" && (
                    <ReferenceDropdown
                        name={props.name}
                        tabIndex={props.tabIndex}
                        currentValue={props.association.value as ObjectItem}
                        isClearable={props.isClearable}
                        clearIcon={props.clearIcon}
                        dropdownIcon={props.dropdownIcon}
                        onSelectAssociation={(newAssociation: ObjectItem | undefined) =>
                            onSelectReferenceHandler(newAssociation as ObjectItem & ObjectItem[])
                        }
                        selectableObjects={props.selectableObjects.items || []}
                        placeholder={props.placeholder.value}
                        isReadOnly={props.association.readOnly}
                        isSearchable={props.isSearchable}
                        maxHeight={props.maxMenuHeight.value}
                        noResultsText={props.noResultsText.value}
                        displayAttribute={props.displayAttribute}
                        optionTextType={props.optionTextType}
                        selectableAttribute={props.selectableAttribute}
                        optionCustomContent={props.optionCustomContent}
                        mxFilter={mxFilter}
                        setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                        moreResultsText={props.selectableObjects.hasMoreItems ? props.moreResultsText.value : undefined}
                        optionsStyle={props.optionsStyle}
                    />
                )}
                {props.association.type === "Reference" && props.selectStyle === "list" && (
                    <ReferenceList
                        name={props.name}
                        tabIndex={props.tabIndex}
                        currentValue={props.association.value as ObjectItem}
                        isClearable={props.isClearable}
                        clearIcon={props.clearIcon}
                        onSelectAssociation={(newAssociation: ObjectItem | undefined) =>
                            onSelectReferenceHandler(newAssociation as ObjectItem & ObjectItem[])
                        }
                        selectableObjects={props.selectableObjects.items || []}
                        placeholder={props.placeholder.value}
                        isReadOnly={props.association.readOnly}
                        noResultsText={props.noResultsText.value}
                        displayAttribute={props.displayAttribute}
                        optionTextType={props.optionTextType}
                        selectableAttribute={props.selectableAttribute}
                        optionCustomContent={props.optionCustomContent}
                        mxFilter={mxFilter}
                        setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                        moreResultsText={props.selectableObjects.hasMoreItems ? props.moreResultsText.value : undefined}
                        optionsStyle={props.optionsStyle}
                        isSearchable={props.isSearchable}
                    />
                )}
                {props.association.type === "ReferenceSet" && props.selectStyle === "dropdown" && (
                    <ReferenceSetDropdown
                        name={props.name}
                        tabIndex={props.tabIndex}
                        currentValues={props.association.value as ObjectItem[]}
                        isClearable={props.isClearable}
                        clearIcon={props.clearIcon}
                        dropdownIcon={props.dropdownIcon}
                        onSelectAssociation={(newAssociation: ObjectItem[] | undefined) =>
                            onSelectReferenceHandler(newAssociation as ObjectItem & ObjectItem[])
                        }
                        selectableObjects={props.selectableObjects.items || []}
                        placeholder={props.placeholder.value}
                        isReadOnly={props.association.readOnly}
                        isSearchable={props.isSearchable}
                        maxHeight={props.maxMenuHeight.value}
                        noResultsText={props.noResultsText.value}
                        displayAttribute={props.displayAttribute}
                        optionTextType={props.optionTextType}
                        selectableAttribute={props.selectableAttribute}
                        optionCustomContent={props.optionCustomContent}
                        mxFilter={mxFilter}
                        setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                        moreResultsText={props.selectableObjects.hasMoreItems ? props.moreResultsText.value : undefined}
                        optionsStyle={props.optionsStyle}
                        referenceSetStyle={props.referenceSetStyle}
                        maxReferenceDisplay={props.maxReferenceDisplay}
                        showSelectAll={props.showSelectAll}
                        selectAllIcon={props.selectAllIcon}
                    />
                )}
                {props.association.type === "ReferenceSet" && props.selectStyle === "list" && (
                    <ReferenceSetList
                        name={props.name}
                        tabIndex={props.tabIndex}
                        currentValues={props.association.value as ObjectItem[]}
                        isClearable={props.isClearable}
                        clearIcon={props.clearIcon}
                        onSelectAssociation={(newAssociation: ObjectItem[] | undefined) =>
                            onSelectReferenceHandler(newAssociation as ObjectItem & ObjectItem[])
                        }
                        selectableObjects={props.selectableObjects.items || []}
                        placeholder={props.placeholder.value}
                        isReadOnly={props.association.readOnly}
                        noResultsText={props.noResultsText.value}
                        displayAttribute={props.displayAttribute}
                        optionTextType={props.optionTextType}
                        selectableAttribute={props.selectableAttribute}
                        optionCustomContent={props.optionCustomContent}
                        mxFilter={mxFilter}
                        setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                        moreResultsText={props.selectableObjects.hasMoreItems ? props.moreResultsText.value : undefined}
                        optionsStyle={props.optionsStyle}
                        isSearchable={props.isSearchable}
                        showSelectAll={props.showSelectAll}
                        selectAllIcon={props.selectAllIcon}
                    />
                )}
                {props.association.validation && <Alert>{props.association.validation}</Alert>}
            </div>
        );
    } else {
        return (
            <LoadingSelector
                name={props.name}
                tabIndex={props.tabIndex}
                placeholder={props.placeholder.value}
                isClearable={props.isClearable}
                clearIcon={props.clearIcon}
                dropdownIcon={props.dropdownIcon}
            />
        );
    }
};

export default SearchableReferenceSelector;
