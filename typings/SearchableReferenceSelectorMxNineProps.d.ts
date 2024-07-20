/**
 * This file was generated from SearchableReferenceSelectorMxNine.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { ComponentType } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListActionValue, ListAttributeValue, ListExpressionValue, ListWidgetValue, ReferenceValue, ReferenceSetValue, WebIcon } from "mendix";
import { Big } from "big.js";

export type SelectionTypeEnum = "enumeration" | "boolean" | "reference" | "referenceSet";

export type EnumFilterTypeEnum = "OFF" | "INCLUDE" | "EXCLUDE";

export type OptionTextTypeEnum = "text" | "html" | "expression" | "custom";

export type FilterModeEnum = "SERVER" | "CLIENT" | "OFF";

export type FilterTypeEnum = "auto" | "manual";

export type FilterFunctionEnum = "contains" | "startsWith";

export interface SearchAttributesType {
    searchAttribute: ListAttributeValue<Big | string>;
}

export type SelectStyleEnum = "dropdown" | "list";

export type LoadDataModeEnum = "INITIAL" | "OPEN";

export type OptionsStyleSingleEnum = "cell" | "radio";

export type OptionsStyleSetEnum = "cell" | "checkbox";

export type ReferenceSetStyleEnum = "badges" | "commas";

export type ReferenceSetValueEnum = "SAME" | "CUSTOM";

export type BadgeColorEnum = "default" | "info" | "primary" | "inverse" | "success" | "warning" | "danger";

export type AutoFocusModeEnum = "OFF" | "FOCUS_SELECTED" | "FOCUS_OPTION";

export interface SearchAttributesPreviewType {
    searchAttribute: string;
}

export interface SearchableReferenceSelectorMxNineContainerProps {
    name: string;
    tabIndex?: number;
    id: string;
    placeholder: DynamicValue<string>;
    selectionType: SelectionTypeEnum;
    reference: ReferenceValue;
    referenceSet: ReferenceSetValue;
    selectableObjects: ListValue;
    selectableCondition: ListExpressionValue<boolean>;
    enumAttribute: EditableValue<string>;
    enumFilterType: EnumFilterTypeEnum;
    enumFilterList: DynamicValue<string>;
    booleanAttribute: EditableValue<boolean>;
    trueLabel: DynamicValue<string>;
    falseLabel: DynamicValue<string>;
    optionTextType: OptionTextTypeEnum;
    displayAttribute: ListAttributeValue<Big | string>;
    optionExpression: ListExpressionValue<string>;
    optionCustomContent: ListWidgetValue;
    isSearchable: boolean;
    filterMode: FilterModeEnum;
    filterDelay: number;
    filterType: FilterTypeEnum;
    filterFunction: FilterFunctionEnum;
    searchAttributes: SearchAttributesType[];
    searchText: EditableValue<string>;
    hasMoreResultsManual: DynamicValue<boolean>;
    onClickMoreResultsText?: ActionValue;
    selectStyle: SelectStyleEnum;
    loadDataMode: LoadDataModeEnum;
    optionsStyleSingle: OptionsStyleSingleEnum;
    optionsStyleSet: OptionsStyleSetEnum;
    maxItems: DynamicValue<Big>;
    allowLoadingSelect: boolean;
    maxMenuHeight?: DynamicValue<string>;
    dropdownIcon?: DynamicValue<WebIcon>;
    isCompact: boolean;
    clearSearchOnSelect: boolean;
    referenceSetStyle: ReferenceSetStyleEnum;
    referenceSetValue: ReferenceSetValueEnum;
    badgeColor: BadgeColorEnum;
    referenceSetValueContent: ListWidgetValue;
    maxReferenceDisplay: number;
    moreResultsText: DynamicValue<string>;
    noResultsText: DynamicValue<string>;
    loadingText: DynamicValue<string>;
    autoFocusMode: AutoFocusModeEnum;
    autoFocusOption_Enum: DynamicValue<string>;
    autoFocusOption_Obj: ListExpressionValue<boolean>;
    showSelectAll: boolean;
    selectAllIconTitle: DynamicValue<string>;
    selectAllIcon?: DynamicValue<WebIcon>;
    isClearable: boolean;
    clearIconTitle: DynamicValue<string>;
    clearAllIconTitle: DynamicValue<string>;
    clearIcon?: DynamicValue<WebIcon>;
    clearAllIcon?: DynamicValue<WebIcon>;
    onChange?: ActionValue;
    onEnter?: ActionValue;
    onLeave?: ActionValue;
    onBadgeClick?: ListActionValue;
    onExtraClick?: ActionValue;
    ariaRequired: DynamicValue<boolean>;
    ariaLabel?: DynamicValue<string>;
    ariaLiveText?: ListExpressionValue<string>;
    ariaSelectedText?: DynamicValue<string>;
    ariaSearchText?: DynamicValue<string>;
    valueAriaLabel?: ListExpressionValue<string>;
    extraAriaLabel?: DynamicValue<string>;
    ariaArrowKeyInstructions?: DynamicValue<string>;
}

export interface SearchableReferenceSelectorMxNinePreviewProps {
    readOnly: boolean;
    placeholder: string;
    selectionType: SelectionTypeEnum;
    reference: string;
    referenceSet: string;
    selectableObjects: {} | { type: string } | null;
    selectableCondition: string;
    enumAttribute: string;
    enumFilterType: EnumFilterTypeEnum;
    enumFilterList: string;
    booleanAttribute: string;
    trueLabel: string;
    falseLabel: string;
    optionTextType: OptionTextTypeEnum;
    displayAttribute: string;
    optionExpression: string;
    optionCustomContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    isSearchable: boolean;
    filterMode: FilterModeEnum;
    filterDelay: number | null;
    filterType: FilterTypeEnum;
    filterFunction: FilterFunctionEnum;
    searchAttributes: SearchAttributesPreviewType[];
    searchText: string;
    hasMoreResultsManual: string;
    onClickMoreResultsText: {} | null;
    selectStyle: SelectStyleEnum;
    loadDataMode: LoadDataModeEnum;
    optionsStyleSingle: OptionsStyleSingleEnum;
    optionsStyleSet: OptionsStyleSetEnum;
    maxItems: string;
    allowLoadingSelect: boolean;
    maxMenuHeight: string;
    dropdownIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    isCompact: boolean;
    clearSearchOnSelect: boolean;
    referenceSetStyle: ReferenceSetStyleEnum;
    referenceSetValue: ReferenceSetValueEnum;
    badgeColor: BadgeColorEnum;
    referenceSetValueContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    maxReferenceDisplay: number | null;
    moreResultsText: string;
    noResultsText: string;
    loadingText: string;
    autoFocusMode: AutoFocusModeEnum;
    autoFocusOption_Enum: string;
    autoFocusOption_Obj: string;
    showSelectAll: boolean;
    selectAllIconTitle: string;
    selectAllIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    isClearable: boolean;
    clearIconTitle: string;
    clearAllIconTitle: string;
    clearIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    clearAllIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    onChange: {} | null;
    onEnter: {} | null;
    onLeave: {} | null;
    onBadgeClick: {} | null;
    onExtraClick: {} | null;
    ariaRequired: string;
    ariaLabel: string;
    ariaLiveText: string;
    ariaSelectedText: string;
    ariaSearchText: string;
    valueAriaLabel: string;
    extraAriaLabel: string;
    ariaArrowKeyInstructions: string;
}
