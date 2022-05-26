/**
 * This file was generated from SearchableReferenceSelector.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { DynamicValue, ListValue, ListAttributeValue, ReferenceValue } from "mendix";

export interface SearchableReferenceSelectorContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    allowEmptySelection: boolean;
    noneSelectedText?: DynamicValue<string>;
    selectableObjects: ListValue;
    association: ReferenceValue;
    displayAttribute: ListAttributeValue<string>;
}

export interface SearchableReferenceSelectorPreviewProps {
    readOnly: boolean;
    allowEmptySelection: boolean;
    noneSelectedText: string;
    selectableObjects: {} | { type: string } | null;
    association: string;
    displayAttribute: string;
}
