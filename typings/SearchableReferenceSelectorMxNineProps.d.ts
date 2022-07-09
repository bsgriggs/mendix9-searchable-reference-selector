/**
 * This file was generated from SearchableReferenceSelectorMxNine.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType } from "react";
import { ActionValue, DynamicValue, ListValue, ListAttributeValue, ListWidgetValue, ReferenceValue, ReferenceSetValue } from "mendix";
import { Big } from "big.js";

export type OptionTextTypeEnum = "text" | "html" | "custom";

export interface SearchableReferenceSelectorMxNineContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    placeholder: DynamicValue<string>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    isClearable: boolean;
    minMenuHeight: DynamicValue<string>;
    maxMenuHeight: DynamicValue<string>;
    noResultsText: DynamicValue<string>;
    maxItems: DynamicValue<Big>;
    selectableObjects: ListValue;
    association: ReferenceValue | ReferenceSetValue;
    displayAttribute: ListAttributeValue<string>;
    selectableAttribute: ListAttributeValue<boolean>;
    onChangeAssociation?: ActionValue;
}

export interface SearchableReferenceSelectorMxNinePreviewProps {
    readOnly: boolean;
    placeholder: string;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    isClearable: boolean;
    minMenuHeight: string;
    maxMenuHeight: string;
    noResultsText: string;
    maxItems: string;
    selectableObjects: {} | { type: string } | null;
    association: string;
    displayAttribute: string;
    selectableAttribute: string;
    onChangeAssociation: {} | null;
}
