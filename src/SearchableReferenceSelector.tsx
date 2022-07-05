import { createElement, useState } from "react";
import { SearchableReferenceSelectorContainerProps } from "../typings/SearchableReferenceSelectorProps";
import { ObjectItem, ValueStatus } from "mendix";
import "./ui/SearchableReferenceSelector.css";
import { Alert } from "./components/Alert";
import ReferenceSelector from "./components/ReferenceSelector";
import ReferenceSetSelector from "./components/ReferenceSetSelector";
import LoadingSelector from "./components/LoadingSelector";

const SearchableReferenceSelector = (props: SearchableReferenceSelectorContainerProps): JSX.Element => {
    if (Number(props.maxItems.value) > 1) {
        props.selectableObjects.setLimit(Number(props.maxItems.value));
    }
    if (
        props.association.status === ValueStatus.Available &&
        props.selectableObjects.status === ValueStatus.Available &&
        props.placeholder.status === ValueStatus.Available &&
        props.minMenuHeight.status === ValueStatus.Available &&
        props.maxMenuHeight.status === ValueStatus.Available
    ) {
        const [currentObjectItem, setCurrentObjectItem] = useState<ObjectItem | undefined>(
            props.association.value as ObjectItem
        );

        const onSelectHandler = (selectedObj: ObjectItem & ObjectItem[]): void => {
            // update Mendix object
            if (selectedObj !== null) {
                props.association.setValue(selectedObj);
                setCurrentObjectItem(selectedObj);
            } else {
                props.association.setValue(undefined);
                setCurrentObjectItem(undefined);
            }
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
            <div id={props.id} className={"searchable-reference-selector"}>
                {props.association.type === "Reference" && (
                    <ReferenceSelector
                        name={props.name}
                        tabIndex={props.tabIndex}
                        currentValue={props.association.value as ObjectItem}
                        allowEmptySelection={props.allowEmptySelection}
                        onSelectHandler={onSelectHandler}
                        selectableObjects={props.selectableObjects.items || []}
                        getLabel={(objectItem: ObjectItem) => props.displayAttribute.get(objectItem).value || ""}
                        getValue={(objectItem: ObjectItem) => objectItem.id}
                        placeholder={props.placeholder.value}
                        isReadOnly={props.association.readOnly}
                        isSearchable={props.searchable}
                        isRightAligned={props.alignment === "rightAligned"}
                        minHeight={
                            props.minMenuHeight.value !== undefined && Number(props.minMenuHeight.value) > 0
                                ? Number(props.minMenuHeight.value)
                                : 0
                        }
                        maxHeight={
                            props.maxMenuHeight.value !== undefined && Number(props.maxMenuHeight.value) > 0
                                ? Number(props.maxMenuHeight.value)
                                : 0
                        }
                        noResultsText={props.noResultsText.value}
                    />
                )}
                {props.association.type === "ReferenceSet" && (
                    <ReferenceSetSelector
                        name={props.name}
                        tabIndex={props.tabIndex}
                        currentValue={props.association.value as ObjectItem[]}
                        allowEmptySelection={props.allowEmptySelection}
                        onSelectHandler={onSelectHandler}
                        selectableObjects={props.selectableObjects.items || []}
                        getLabel={(objectItems: ObjectItem & ObjectItem[]) =>
                            Array.isArray(objectItems)
                                ? objectItems
                                      .map(objectItem => props.displayAttribute.get(objectItem).value || "")
                                      .join(", ")
                                : props.displayAttribute.get(objectItems).value || ""
                        }
                        getValue={(objectItems: ObjectItem & ObjectItem[]) =>
                            Array.isArray(objectItems)
                                ? objectItems.map(objectItem => objectItem.id).join(", ")
                                : objectItems
                        }
                        placeholder={props.placeholder.value}
                        isReadOnly={props.association.readOnly}
                        isSearchable={props.searchable}
                        isRightAligned={props.alignment === "rightAligned"}
                        minHeight={
                            props.minMenuHeight.value !== undefined && Number(props.minMenuHeight.value) > 0
                                ? Number(props.minMenuHeight.value)
                                : 0
                        }
                        maxHeight={
                            props.maxMenuHeight.value !== undefined && Number(props.maxMenuHeight.value) > 0
                                ? Number(props.maxMenuHeight.value)
                                : 0
                        }
                        noResultsText={props.noResultsText.value}
                    />
                )}
                {props.association.validation && <Alert>{props.association.validation}</Alert>}
            </div>
        );
    } else {
        return <LoadingSelector name={props.name} tabIndex={props.tabIndex} placeholder={props.placeholder.value} />;
    }
};

export default SearchableReferenceSelector;
