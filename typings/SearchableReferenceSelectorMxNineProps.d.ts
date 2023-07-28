/**
 * This file was generated from SearchableReferenceSelectorMxNine.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListActionValue, ListAttributeValue, ListExpressionValue, ListWidgetValue, ReferenceValue, ReferenceSetValue, WebIcon } from "mendix";
import { Big } from "big.js";

export type SelectionTypeEnum = "enumeration" | "reference" | "referenceSet";

export type OptionTextTypeEnum = "text" | "html" | "textTemplate" | "custom";

export type FilterTypeEnum = "auto" | "manual";

export type FilterFunctionEnum = "contains" | "startsWith";

export interface SearchAttributesType {
    searchAttribute: ListAttributeValue<string | Big>;
}

export type SelectStyleEnum = "dropdown" | "list";

export type OptionsStyleSingleEnum = "cell" | "radio";

export type OptionsStyleSetEnum = "cell" | "checkbox";

export type ReferenceSetStyleEnum = "badges" | "commas";

export type ReferenceSetValueEnum = "SAME" | "CUSTOM";

export type BadgeColorEnum = "default" | "info" | "primary" | "inverse" | "success" | "warning" | "danger";

export interface SearchAttributesPreviewType {
    searchAttribute: string;
}

export interface SearchableReferenceSelectorMxNineContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    placeholder: DynamicValue<string>;
    selectionType: SelectionTypeEnum;
    selectableObjects: ListValue;
    reference: ReferenceValue;
    referenceSet: ReferenceSetValue;
    selectableCondition: ListExpressionValue<boolean>;
    enumAttribute: EditableValue<string>;
    optionTextType: OptionTextTypeEnum;
    displayAttribute: ListAttributeValue<string | Big>;
    optionExpression: ListExpressionValue<string>;
    optionCustomContent: ListWidgetValue;
    isSearchable: boolean;
    filterDelay: number;
    filterType: FilterTypeEnum;
    filterFunction: FilterFunctionEnum;
    searchAttributes: SearchAttributesType[];
    searchText: EditableValue<string>;
    hasMoreResultsManual: DynamicValue<boolean>;
    onClickMoreResultsText?: ActionValue;
    selectStyle: SelectStyleEnum;
    optionsStyleSingle: OptionsStyleSingleEnum;
    optionsStyleSet: OptionsStyleSetEnum;
    maxItems: DynamicValue<Big>;
    allowLoadingSelect: boolean;
    maxMenuHeight: DynamicValue<string>;
    dropdownIcon?: DynamicValue<WebIcon>;
    clearSearchOnSelect: boolean;
    referenceSetStyle: ReferenceSetStyleEnum;
    isCompact: boolean;
    referenceSetValue: ReferenceSetValueEnum;
    badgeColor: BadgeColorEnum;
    referenceSetValueContent: ListWidgetValue;
    maxReferenceDisplay: number;
    moreResultsText: DynamicValue<string>;
    noResultsText: DynamicValue<string>;
    loadingText: DynamicValue<string>;
    showSelectAll: boolean;
    selectAllIconTitle: DynamicValue<string>;
    selectAllIcon?: DynamicValue<WebIcon>;
    isClearable: boolean;
    clearIconTitle: DynamicValue<string>;
    clearIcon?: DynamicValue<WebIcon>;
    onChange?: ActionValue;
    onLeave?: ActionValue;
    onBadgeClick?: ListActionValue;
}

export interface SearchableReferenceSelectorMxNinePreviewProps {
    readOnly: boolean;
    placeholder: string;
    selectionType: SelectionTypeEnum;
    selectableObjects: {} | { type: string } | null;
    reference: string;
    referenceSet: string;
    selectableCondition: string;
    enumAttribute: string;
    optionTextType: OptionTextTypeEnum;
    displayAttribute: string;
    optionExpression: string;
    optionCustomContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    isSearchable: boolean;
    filterDelay: number | null;
    filterType: FilterTypeEnum;
    filterFunction: FilterFunctionEnum;
    searchAttributes: SearchAttributesPreviewType[];
    searchText: string;
    hasMoreResultsManual: string;
    onClickMoreResultsText: {} | null;
    selectStyle: SelectStyleEnum;
    optionsStyleSingle: OptionsStyleSingleEnum;
    optionsStyleSet: OptionsStyleSetEnum;
    maxItems: string;
    allowLoadingSelect: boolean;
    maxMenuHeight: string;
    dropdownIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    clearSearchOnSelect: boolean;
    referenceSetStyle: ReferenceSetStyleEnum;
    isCompact: boolean;
    referenceSetValue: ReferenceSetValueEnum;
    badgeColor: BadgeColorEnum;
    referenceSetValueContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    maxReferenceDisplay: number | null;
    moreResultsText: string;
    noResultsText: string;
    loadingText: string;
    showSelectAll: boolean;
    selectAllIconTitle: string;
    selectAllIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    isClearable: boolean;
    clearIconTitle: string;
    clearIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    onChange: {} | null;
    onLeave: {} | null;
    onBadgeClick: {} | null;
}
