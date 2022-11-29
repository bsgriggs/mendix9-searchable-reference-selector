/**
 * This file was generated from SearchableReferenceSelectorMxNine.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType } from "react";
import {
    ActionValue,
    DynamicValue,
    ListValue,
    ListActionValue,
    ListAttributeValue,
    ListWidgetValue,
    ReferenceValue,
    ReferenceSetValue,
    WebIcon
} from "mendix";
import { Big } from "big.js";

export type SelectStyleEnum = "dropdown" | "list";

export type OptionTextTypeEnum = "text" | "html" | "custom";

export type OptionsStyleEnum = "cell" | "checkbox" | "radio";

export type ReferenceSetStyleEnum = "badges" | "commas";

export interface SearchableReferenceSelectorMxNineContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    placeholder: DynamicValue<string>;
    isSearchable: boolean;
    isClearable: boolean;
    showSelectAll: boolean;
    maxItems: DynamicValue<Big>;
    moreResultsText: DynamicValue<string>;
    filterDelay: number;
    selectStyle: SelectStyleEnum;
    optionTextType: OptionTextTypeEnum;
    optionsStyle: OptionsStyleEnum;
    optionCustomContent?: ListWidgetValue;
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number;
    maxMenuHeight: DynamicValue<string>;
    noResultsText: DynamicValue<string>;
    clearIcon?: DynamicValue<WebIcon>;
    dropdownIcon?: DynamicValue<WebIcon>;
    selectAllIcon?: DynamicValue<WebIcon>;
    selectableObjects: ListValue;
    association: ReferenceValue | ReferenceSetValue;
    displayAttribute: ListAttributeValue<string>;
    selectableAttribute?: ListAttributeValue<boolean>;
    onChangeAssociation?: ActionValue;
    onBadgeClick?: ListActionValue;
}

export interface SearchableReferenceSelectorMxNinePreviewProps {
    readOnly: boolean;
    placeholder: string;
    isSearchable: boolean;
    isClearable: boolean;
    showSelectAll: boolean;
    maxItems: string;
    moreResultsText: string;
    filterDelay: number | null;
    selectStyle: SelectStyleEnum;
    optionTextType: OptionTextTypeEnum;
    optionsStyle: OptionsStyleEnum;
    optionCustomContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number | null;
    maxMenuHeight: string;
    noResultsText: string;
    clearIcon: { type: "glyph"; iconClass: string } | { type: "image"; imageUrl: string } | null;
    dropdownIcon: { type: "glyph"; iconClass: string } | { type: "image"; imageUrl: string } | null;
    selectAllIcon: { type: "glyph"; iconClass: string } | { type: "image"; imageUrl: string } | null;
    selectableObjects: {} | { type: string } | null;
    association: string;
    displayAttribute: string;
    selectableAttribute: string;
    onChangeAssociation: {} | null;
    onBadgeClick: {} | null;
}
