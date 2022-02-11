import { ReactElement, createElement } from "react";
import SearchableReferenceSelectorComp from "./components/searchable-reference-selector";

import { SearchableReferenceSelectorContainerProps } from "../typings/SearchableReferenceSelectorProps";

import "./ui/SearchableReferenceSelector.css";

export function SearchableReferenceSelector(props: SearchableReferenceSelectorContainerProps): ReactElement {
    if (props.currentValue.status !== "loading" && props.selectableObjects.status !== "loading") {
        const emptyText =
            props.noneSelectedText !== undefined && props.noneSelectedText.value !== undefined
                ? props.noneSelectedText.value
                : "";
        return (
            <SearchableReferenceSelectorComp
                key={props.name}
                tabIndex={props.tabIndex ? props.tabIndex : -1}
                className={props.class}
                name={props.name}
                style={props.style}
                currentValue={props.currentValue && props.currentValue.value ? props.currentValue.value : emptyText}
                selectableObjects={props.selectableObjects}
                displayAttribute={props.displayAttribute}
                noneSelectedText={emptyText}
                onSelectAssociation={props.onSelectAssociation}
                onSelectEmpty={props.onSelectEmpty}
            />
        );
    } else {
        return <div></div>;
    }
}
