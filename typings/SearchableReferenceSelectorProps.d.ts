/**
 * This file was generated from SearchableReferenceSelector.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ActionValue, DynamicValue, ListValue, ListAttributeValue, ReferenceValue, ReferenceSetValue } from "mendix";
import { Big } from "big.js";

export type AlignmentEnum = "leftAligned" | "rightAligned";

export interface SearchableReferenceSelectorContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    placeholder: DynamicValue<string>;
    searchable: boolean;
    alignment: AlignmentEnum;
    allowEmptySelection: boolean;
    minMenuHeight: DynamicValue<Big>;
    maxMenuHeight: DynamicValue<Big>;
    noResultsText: DynamicValue<string>;
    maxItems: DynamicValue<Big>;
    selectableObjects: ListValue;
    association: ReferenceValue | ReferenceSetValue;
    displayAttribute: ListAttributeValue<string>;
    onChangeAssociation?: ActionValue;
}

export interface SearchableReferenceSelectorPreviewProps {
    readOnly: boolean;
    placeholder: string;
    searchable: boolean;
    alignment: AlignmentEnum;
    allowEmptySelection: boolean;
    minMenuHeight: string;
    maxMenuHeight: string;
    noResultsText: string;
    maxItems: string;
    selectableObjects: {} | { type: string } | null;
    association: string;
    displayAttribute: string;
    onChangeAssociation: {} | null;
}
