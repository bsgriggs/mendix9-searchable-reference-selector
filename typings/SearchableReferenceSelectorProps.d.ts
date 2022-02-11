/**
 * This file was generated from SearchableReferenceSelector.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListActionValue, ListAttributeValue } from "mendix";

export interface SearchableReferenceSelectorContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    noneSelectedText?: DynamicValue<string>;
    selectableObjects: ListValue;
    displayAttribute: ListAttributeValue<string>;
    currentValue: EditableValue<string>;
    onSelectAssociation?: ListActionValue;
    onSelectEmpty?: ActionValue;
}

export interface SearchableReferenceSelectorPreviewProps {
    className: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    noneSelectedText: string;
    selectableObjects: {} | { type: string } | null;
    displayAttribute: string;
    currentValue: string;
    onSelectAssociation: {} | null;
    onSelectEmpty: {} | null;
}
