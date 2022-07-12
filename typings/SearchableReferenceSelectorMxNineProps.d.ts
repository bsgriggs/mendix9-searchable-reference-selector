/**
 * This file was generated from SearchableReferenceSelectorMxNine.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType } from "react";
import { ActionValue, DynamicValue, ListValue, ListAttributeValue, ListWidgetValue, ReferenceValue, ReferenceSetValue } from "mendix";
import { Big } from "big.js";

export type OptionTextTypeEnum = "text" | "html" | "custom";

export type OptionsStyleEnum = "cell" | "checkbox";

export type ReferenceSetStyleEnum = "badges" | "commas";

export interface SearchableReferenceSelectorMxNineContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    placeholder: DynamicValue<string>;
    isClearable: boolean;
    maxItems: DynamicValue<Big>;
    filterDelay: number;
    optionTextType: OptionTextTypeEnum;
    optionsStyle: OptionsStyleEnum;
    optionCustomContent?: ListWidgetValue;
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number;
    maxMenuHeight: DynamicValue<string>;
    noResultsText: DynamicValue<string>;
    moreResultsText: DynamicValue<string>;
    selectableObjects: ListValue;
    association: ReferenceValue | ReferenceSetValue;
    displayAttribute: ListAttributeValue<string>;
    selectableAttribute?: ListAttributeValue<boolean>;
    onChangeAssociation?: ActionValue;
}

export interface SearchableReferenceSelectorMxNinePreviewProps {
    readOnly: boolean;
    placeholder: string;
    isClearable: boolean;
    maxItems: string;
    filterDelay: number | null;
    optionTextType: OptionTextTypeEnum;
    optionsStyle: OptionsStyleEnum;
    optionCustomContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number | null;
    maxMenuHeight: string;
    noResultsText: string;
    moreResultsText: string;
    selectableObjects: {} | { type: string } | null;
    association: string;
    displayAttribute: string;
    selectableAttribute: string;
    onChangeAssociation: {} | null;
}
