/**
 * This file was generated from SearchableReferenceSelectorMxNine.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { ComponentType } from "react";
import { ActionValue, DynamicValue, EditableValue, ListValue, ListActionValue, ListAttributeValue, ListExpressionValue, ListWidgetValue, ReferenceValue, ReferenceSetValue, WebIcon } from "mendix";
import { Big } from "big.js";

export type SelectStyleEnum = "dropdown" | "list";

export type OptionTextTypeEnum = "text" | "html" | "custom";

export type OptionsStyleSingleEnum = "cell" | "radio";

export type OptionsStyleSetEnum = "cell" | "checkbox";

export type ReferenceSetStyleEnum = "badges" | "commas";

export type SelectionTypeEnum = "enumeration" | "reference" | "referenceSet";

export type FilterTypeEnum = "auto" | "manual";

export type FilterFunctionEnum = "contains" | "startsWith";

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
    noResultsText: DynamicValue<string>;
    selectStyle: SelectStyleEnum;
    optionTextType: OptionTextTypeEnum;
    optionsStyleSingle: OptionsStyleSingleEnum;
    optionsStyleSet: OptionsStyleSetEnum;
    optionCustomContent?: ListWidgetValue;
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number;
    maxMenuHeight: DynamicValue<string>;
    clearIcon?: DynamicValue<WebIcon>;
    dropdownIcon?: DynamicValue<WebIcon>;
    selectAllIcon?: DynamicValue<WebIcon>;
    selectionType: SelectionTypeEnum;
    selectableObjects: ListValue;
    association: ReferenceValue | ReferenceSetValue;
    displayAttribute: ListAttributeValue<string>;
    selectableCondition: ListExpressionValue<boolean>;
    enumAttribute: EditableValue<string>;
    onChange?: ActionValue;
    onBadgeClick?: ListActionValue;
    filterDelay: number;
    filterType: FilterTypeEnum;
    filterFunction: FilterFunctionEnum;
    searchText: EditableValue<string>;
    hasMoreResultsManual: DynamicValue<boolean>;
    onClickMoreResultsText?: ActionValue;
    refreshAction?: ActionValue;
}

export interface SearchableReferenceSelectorMxNinePreviewProps {
    readOnly: boolean;
    placeholder: string;
    isSearchable: boolean;
    isClearable: boolean;
    showSelectAll: boolean;
    maxItems: string;
    moreResultsText: string;
    noResultsText: string;
    selectStyle: SelectStyleEnum;
    optionTextType: OptionTextTypeEnum;
    optionsStyleSingle: OptionsStyleSingleEnum;
    optionsStyleSet: OptionsStyleSetEnum;
    optionCustomContent: { widgetCount: number; renderer: ComponentType<{ caption?: string }> };
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number | null;
    maxMenuHeight: string;
    clearIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    dropdownIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    selectAllIcon: { type: "glyph"; iconClass: string; } | { type: "image"; imageUrl: string; } | null;
    selectionType: SelectionTypeEnum;
    selectableObjects: {} | { type: string } | null;
    association: string;
    displayAttribute: string;
    selectableCondition: string;
    enumAttribute: string;
    onChange: {} | null;
    onBadgeClick: {} | null;
    filterDelay: number | null;
    filterType: FilterTypeEnum;
    filterFunction: FilterFunctionEnum;
    searchText: string;
    hasMoreResultsManual: string;
    onClickMoreResultsText: {} | null;
    refreshAction: {} | null;
}
