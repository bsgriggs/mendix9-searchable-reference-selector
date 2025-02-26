import { SearchableReferenceSelectorMxNinePreviewProps } from "../typings/SearchableReferenceSelectorMxNineProps";
import { hidePropertiesIn, hidePropertyIn } from "@mendix/pluggable-widgets-tools";

export type Platform = "web" | "desktop";

export type Properties = PropertyGroup[];

type PropertyGroup = {
    caption: string;
    propertyGroups?: PropertyGroup[];
    properties?: Property[];
};

type Property = {
    key: string;
    caption: string;
    description?: string;
    objectHeaders?: string[]; // used for customizing object grids
    objects?: ObjectProperties[];
    properties?: Properties[];
};

type ObjectProperties = {
    properties: PropertyGroup[];
    captions?: string[]; // used for customizing object grids
};

export type Problem = {
    property?: string; // key of the property, at which the problem exists
    severity?: "error" | "warning" | "deprecation"; // default = "error"
    message: string; // description of the problem
    studioMessage?: string; // studio-specific message, defaults to message
    url?: string; // link with more information about the problem
    studioUrl?: string; // studio-specific link
};

type BaseProps = {
    type: "Image" | "Container" | "RowLayout" | "Text" | "DropZone" | "Selectable" | "Datasource";
    grow?: number; // optionally sets a growth factor if used in a layout (default = 1)
};

type ImageProps = BaseProps & {
    type: "Image";
    document?: string; // svg image
    data?: string; // base64 image
    property?: { type: "glyph"; iconClass: string } | { type: "image"; imageUrl: string } | null; // widget image property object from Values API
    width?: number; // sets a fixed maximum width
    height?: number; // sets a fixed maximum height
};

type ContainerProps = BaseProps & {
    type: "Container" | "RowLayout";
    children: PreviewProps[]; // any other preview element
    borders?: boolean; // sets borders around the layout to visually group its children
    borderRadius?: number; // integer. Can be used to create rounded borders
    backgroundColor?: string; // HTML color, formatted #RRGGBB
    borderWidth?: number; // sets the border width
    padding?: number; // integer. adds padding around the container
};

type RowLayoutProps = ContainerProps & {
    type: "RowLayout";
    columnSize?: "fixed" | "grow"; // default is fixed
};

type TextProps = BaseProps & {
    type: "Text";
    content: string; // text that should be shown
    fontSize?: number; // sets the font size
    fontColor?: string; // HTML color, formatted #RRGGBB
    bold?: boolean;
    italic?: boolean;
};

type DropZoneProps = BaseProps & {
    type: "DropZone";
    placeholder?: string;
    property: object; // widgets property object from Values API
};

type SelectableProps = BaseProps & {
    type: "Selectable";
    object: object; // object property instance from the Value API
    child: PreviewProps; // any type of preview property to visualize the object instance
};

type DatasourceProps = BaseProps & {
    type: "Datasource";
    property: object | null; // datasource property object from Values API
    child?: PreviewProps; // any type of preview property component (optional)
};

export type PreviewProps =
    | ImageProps
    | ContainerProps
    | RowLayoutProps
    | TextProps
    | DropZoneProps
    | SelectableProps
    | DatasourceProps;

export const getDisplayName = (_values: SearchableReferenceSelectorMxNinePreviewProps): string => {
    if (_values.selectionType === "enumeration") {
        return "[" + (_values.enumAttribute.length > 0 ? _values.enumAttribute : "No attribute selected") + "]";
    } else if (_values.selectionType === "boolean") {
        return "[" + (_values.booleanAttribute.length > 0 ? _values.booleanAttribute : "No attribute selected") + "]";
    } else {
        const refText = _values.selectionType === "reference" ? _values.reference : _values.referenceSet;
        if (refText.length > 0) {
            const associationNameRef = refText.substring(refText.indexOf(".") + 1);
            const arr = associationNameRef.split(".");
            let retString = "";
            for (let i = 0; i < arr.length; i++) {
                if (i === arr.length - 1) {
                    retString += arr[i];
                } else {
                    retString = retString + arr[i].substring(0, arr[i].indexOf("/") + 1);
                }
            }
            return (
                "[" +
                retString +
                "/" +
                (_values.optionTextType !== "custom"
                    ? _values.optionTextType !== "expression"
                        ? _values.displayAttribute
                        : _values.optionExpression
                    : "CustomContent"
                ).trim() +
                "]"
            );
        } else {
            return "[No content selected]";
        }
    }
};

export function getProperties(
    _values: SearchableReferenceSelectorMxNinePreviewProps,
    defaultProperties: Properties
): Properties {
    switch (_values.selectionType) {
        case "enumeration":
            hidePropertiesIn(defaultProperties, _values, [
                "reference",
                "referenceSet",
                "selectableCondition",
                "selectableObjects",
                "showSelectAll",
                "referenceSetStyle",
                "maxReferenceDisplay",
                "selectAllIcon",
                "selectAllIconTitle",
                "onBadgeClick",
                "valueAriaLabel",
                "optionsStyleSet",
                "filterType",
                "moreResultsText",
                "maxItems",
                "allowLoadingSelect",
                "loadingText",
                "referenceSetValue",
                "referenceSetValueContent",
                "clearSearchOnSelect",
                "searchAttributes",
                "optionCustomContent",
                "ariaLiveText",
                "optionTextType",
                "displayAttribute",
                "optionExpression",
                "isCompact",
                "filterMode",
                "booleanAttribute",
                "trueLabel",
                "falseLabel",
                "loadDataMode",
                "ariaArrowKeyInstructions",
                "clearAllIcon",
                "clearAllIconTitle",
                "badgeColor",
                "optionClassName"
            ]);
            break;
        case "boolean":
            hidePropertiesIn(defaultProperties, _values, [
                "reference",
                "referenceSet",
                "selectableCondition",
                "selectableObjects",
                "showSelectAll",
                "referenceSetStyle",
                "maxReferenceDisplay",
                "selectAllIcon",
                "selectAllIconTitle",
                "onBadgeClick",
                "valueAriaLabel",
                "optionsStyleSet",
                "filterType",
                "moreResultsText",
                "maxItems",
                "allowLoadingSelect",
                "loadingText",
                "referenceSetValue",
                "referenceSetValueContent",
                "clearSearchOnSelect",
                "searchAttributes",
                "optionCustomContent",
                "ariaLiveText",
                "optionTextType",
                "displayAttribute",
                "optionExpression",
                "isCompact",
                "filterMode",
                "enumAttribute",
                "isClearable",
                "clearIcon",
                "clearIconTitle",
                "clearAllIcon",
                "clearAllIconTitle",
                "maxMenuHeight",
                "placeholder",
                "loadDataMode",
                "enumFilterType",
                "enumFilterList",
                "autoFocusMode",
                "autoFocusOption_Enum",
                "autoFocusOption_Obj",
                "ariaArrowKeyInstructions",
                "badgeColor",
                "optionClassName"
            ]);

            break;
        case "reference":
            hidePropertiesIn(defaultProperties, _values, [
                "showSelectAll",
                "referenceSetStyle",
                "maxReferenceDisplay",
                "selectAllIcon",
                "selectAllIconTitle",
                "onBadgeClick",
                "valueAriaLabel",
                "enumAttribute",
                "referenceSet",
                "optionsStyleSet",
                "referenceSetValue",
                "referenceSetValueContent",
                "clearSearchOnSelect",
                "isCompact",
                "booleanAttribute",
                "trueLabel",
                "falseLabel",
                "isSearchable",
                "enumFilterType",
                "enumFilterList",
                "ariaArrowKeyInstructions",
                "clearAllIcon",
                "clearAllIconTitle",
                "badgeColor"
            ]);
            break;
        case "referenceSet":
            hidePropertiesIn(defaultProperties, _values, [
                "enumAttribute",
                "reference",
                "optionsStyleSingle",
                "booleanAttribute",
                "trueLabel",
                "falseLabel",
                "isSearchable",
                "enumFilterType",
                "enumFilterList",
                "ariaArrowKeyInstructions"
            ]);
            break;
    }

    switch (_values.filterType) {
        case "auto":
            hidePropertiesIn(defaultProperties, _values, [
                // "searchText",
                "hasMoreResultsManual",
                "onClickMoreResultsText"
            ]);
            break;
        case "manual":
            hidePropertiesIn(defaultProperties, _values, ["filterFunction", "maxItems", "searchAttributes"]);
            break;
    }

    switch (_values.optionTextType) {
        case "text":
            hidePropertiesIn(defaultProperties, _values, [
                "optionCustomContent",
                "searchAttributes",
                "optionExpression"
            ]);
            break;
        case "html":
            hidePropertiesIn(defaultProperties, _values, [
                "optionCustomContent",
                "searchAttributes",
                "optionExpression"
            ]);
            break;
        case "expression":
            hidePropertiesIn(defaultProperties, _values, ["optionCustomContent", "displayAttribute"]);
            break;
        case "custom":
            hidePropertyIn(defaultProperties, _values, "displayAttribute");
            if (_values.filterMode !== "CLIENT" && _values.selectionType !== "referenceSet") {
                hidePropertyIn(defaultProperties, _values, "optionExpression");
            }

            break;
    }

    switch (_values.autoFocusMode) {
        case "OFF":
            hidePropertiesIn(defaultProperties, _values, ["autoFocusOption_Enum", "autoFocusOption_Obj"]);
            break;
        case "FOCUS_SELECTED":
            hidePropertiesIn(defaultProperties, _values, ["autoFocusOption_Enum", "autoFocusOption_Obj"]);
            break;
        case "FOCUS_OPTION":
            switch (_values.selectionType) {
                case "boolean":
                    hidePropertiesIn(defaultProperties, _values, [
                        "autoFocusMode",
                        "autoFocusOption_Enum",
                        "autoFocusOption_Obj"
                    ]);
                    break;
                case "enumeration":
                    hidePropertyIn(defaultProperties, _values, "autoFocusOption_Obj");
                    break;
                default: // else
                    hidePropertyIn(defaultProperties, _values, "autoFocusOption_Enum");
                    break;
            }
    }

    if (parseInt(_values.maxItems) === 0) {
        hidePropertiesIn(defaultProperties, _values, ["moreResultsText"]);
    }

    if (_values.selectionType === "referenceSet" && _values.referenceSetStyle === "commas") {
        hidePropertiesIn(defaultProperties, _values, ["badgeColor", "clearAllIcon", "clearAllIconTitle"]);
    }

    if (_values.selectStyle === "list") {
        hidePropertiesIn(defaultProperties, _values, ["dropdownIcon", "loadDataMode"]);
    }

    if (_values.referenceSetValue === "SAME") {
        hidePropertyIn(defaultProperties, _values, "referenceSetValueContent");
    }

    if (_values.isClearable === false) {
        if (_values.selectionType !== "referenceSet") {
            hidePropertiesIn(defaultProperties, _values, ["clearIcon", "clearIconTitle"]);
        } else {
            //clear icon and clear icon title are still used for the badges icons
            hidePropertiesIn(defaultProperties, _values, ["clearAllIcon", "clearAllIconTitle"]);
        }
    }

    if (_values.showSelectAll === false) {
        hidePropertiesIn(defaultProperties, _values, ["selectAllIcon", "selectAllIconTitle"]);
    }

    if (_values.isSearchable === false || _values.filterMode === "OFF") {
        hidePropertiesIn(defaultProperties, _values, [
            "maxItems",
            "filterDelay",
            "moreResultsText",
            "filterDelay",
            "filterType",
            "filterFunction",
            "searchText",
            "hasMoreResultsManual",
            "clearSearchOnSelect",
            "searchAttributes",
            "onClickMoreResultsText",
            "ariaSearchText"
        ]);
    }

    if (_values.maxReferenceDisplay !== null && _values.maxReferenceDisplay === 0) {
        hidePropertiesIn(defaultProperties, _values, ["onExtraClick", "extraAriaLabel"]);
    }

    if (_values.filterMode === "CLIENT") {
        hidePropertiesIn(defaultProperties, _values, ["searchAttributes", "filterType"]);
    }

    if (_values.enumFilterType === "OFF") {
        hidePropertyIn(defaultProperties, _values, "enumFilterList");
    }

    if (_values.showFooter === false) {
        hidePropertyIn(defaultProperties, _values, "footerContent");
    }

    // if (_values.selectionType !== "reference" && _values.selectionType !== "referenceSet") {
    //     hidePropertyIn(defaultProperties, _values, "optionsSourceDatabaseItemSelection");
    // }

    return defaultProperties;
}

export function check(_values: SearchableReferenceSelectorMxNinePreviewProps): Problem[] {
    const errors: Problem[] = [];

    if (
        (_values.selectionType === "reference" || _values.selectionType === "referenceSet") &&
        _values.filterType === "auto" &&
        _values.searchAttributes.length === 0 &&
        _values.filterMode === "SERVER" &&
        (_values.optionTextType === "custom" || _values.optionTextType === "expression")
    ) {
        errors.push({
            property: `searchAttributes`,
            message: `At least 1 search attribute is required for server-side searching`,
            url: "https://github.com/bsgriggs/mendix9-searchable-reference-selector"
        });
    }

    if (
        (_values.selectionType === "reference" || _values.selectionType === "referenceSet") &&
        _values.filterType === "auto" &&
        _values.filterMode === "CLIENT" &&
        (_values.optionTextType === "custom" || _values.optionTextType === "expression") &&
        _values.optionExpression.trim() === ""
    ) {
        errors.push({
            property: `optionExpression`,
            message: `Option content is required for client-side searching. It determines the string that is searched.`,
            url: "https://github.com/bsgriggs/mendix9-searchable-reference-selector"
        });
    }

    if (
        _values.selectionType === "referenceSet" &&
        _values.optionTextType === "custom" &&
        _values.optionExpression.trim() === ""
    ) {
        errors.push({
            property: `optionExpression`,
            message: `Option content is required for reference sets with custom content. It determines the sorting of the selected values (text ascending).`,
            url: "https://github.com/bsgriggs/mendix9-searchable-reference-selector"
        });
    }

    if (_values.filterDelay === null || _values.filterDelay < 0) {
        errors.push({
            property: `filterDelay`,
            message: `Filter Delay must be greater than or equal to 0`,
            url: "https://github.com/bsgriggs/mendix9-searchable-reference-selector"
        });
    }

    if (parseInt(_values.maxItems) < 0) {
        errors.push({
            property: `maxItems`,
            message: `Max Items must be greater than or equal to 0`,
            url: "https://github.com/bsgriggs/mendix9-searchable-reference-selector"
        });
    }

    // if (_values.optionTextType === "custom" && _values.filterMode === "SERVER" && _values.ariaLiveText === "") {
    //     errors.push({
    //         property: `ariaLiveText`,
    //         message:`Accessibility -> Option aria text is required for custom content, so screen readers know the selected value.`,
    //         url: "https://github.com/bsgriggs/mendix9-searchable-reference-selector"
    //     });
    // }
    // if (
    //     _values.optionTextType === "custom" &&
    //     _values.ariaLiveText === "" &&
    //     _values.selectionType === "referenceSet"
    // ) {
    //     errors.push({
    //         property: `ariaLiveText`,
    //         message: `Accessibility -> Option aria text is required for reference sets with custom content. Used for sorting the selected options (by the text ascending) & so screen readers know the selected value.`,
    //         url: "https://github.com/bsgriggs/mendix9-searchable-reference-selector"
    //     });
    // }

    if (
        _values.filterType === "manual" &&
        (_values.searchText === undefined || _values.searchText === null || _values.searchText === "")
    ) {
        errors.push({
            property: `searchText`,
            message: `Search text attribute is required for search type 'by data source microflow'`,
            url: "https://github.com/bsgriggs/mendix9-searchable-reference-selector"
        });
    }

    return errors;
}

export const getPreview = (
    _values: SearchableReferenceSelectorMxNinePreviewProps,
    isDarkMode: boolean
): PreviewProps => {
    const mainContent: PreviewProps = {
        type: "RowLayout",
        columnSize: "grow",
        backgroundColor: _values.readOnly ? (isDarkMode ? "#505050" : "#D3D3D3") : isDarkMode ? "#252525" : "#FFFFFF",
        borders: true,
        borderWidth: 1,
        borderRadius: 1,
        children: [
            {
                type: "Container",
                padding: 4,
                grow: 0,
                children: [
                    {
                        type: "Image",
                        width: 20,
                        height: 20,
                        data: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAARESURBVHgB7Zo/TFNBHMd/RfnbP7aGyMDS4KAkYBgUxEVj62Qi4OCgwdZBFyEGp5bEaGKC3RgwDpoYidGR4g4yGlgkYIITjwE0NWgLBRQQ6/2ulpT27r13z5Y+2vskR+D6aN/v+373+3M9AIlEIpFIJBIAJxkPyZggI1Gk4yMZfpbxbjIUk91sPofyz+ZdFJPfcL5EcB6CpEv4ofTAJb9ZRn7cS5/1+XwQjUYhkUgU1VAUhdqWwXkLJN1hF7zQ7XZDMRKLxcDlcu2ZyxIA1SpmLBbLnr/LoMSRAkCJcxgMMjWzBXPKNszNb8NSZGd3vvF4ObQ1VcCZU5XgsFrA7AgHQTR86G0cpmY3Va+zE+O97dXQe90O9XWHwCxkBkHdAuBTDgzGNA3PBI3vvWGHLk8NmAFDAqDx3YFlWPq2A0bpIZ6AQhQa4TSYC+ORp2TZDI+ug9nQFADX+/8an2LgxQoJmr/BTKgugfDYBl33PHB9X/XWwMmGchLxy2B1/Q+Mf/gFI+T/eLQ2V8DrUC0UCqEYcPFWhPv0fZ026L/tYL6mtWxQABSiEOiOATS/cwzAYMYzHkHPQCPtnDogrOIh+w1XAMz3LNA4jOha4HX+DhvztTGyTMwCX4BP7Hzvu2IDvdzstDLnMVakV4+FhCvA6hq7IMJSVy8YGOuPsavA1XVztN15b4bq69jtRpx4gRngCuCwsQPYUkQsj8/Ns2OJ3WqORpR7FzzXHRGI4BhI4xxXb2ww3IjmFK4AraSdZTE1u0WHHrCKZNHWXAlmgS8AKVR4eTwwGNWM4kNv+C1z1yVzdIYIPwaQNcrL47TSCy5DeHwjK5qj23cHvtPmhwXWB61NYlUgNlGnr32FE5e/0PfWEh8LrbuPf9CB96iGaimM+RrL4bhGympsSKbGRRIgta7FKlJPIZWC1Y/QSvNJLXOjBT0vU/xnD46C52wV/V2oHUYvCN13gRZYNuOI68jti4JZZGTsZ9ZcygMzPYFlPPJqdA14aOYiL1EulxsZYWIQxhC98NPxXhF4xtNrVdp5XckYXbb/zhHIFSIi+Dr4pXdKhIHnK1zjEbWsI7Qpih8YJOtxUnBfkEeXtxpCfdpLDI3DJ2yEzHhheFM0HawDMDhNzmwy3QsV97RXEQNr6NNRa3/zKQIrWOZEgHQwDX4mAZB+IKkeWZEZo7iaCLh13qMjzoiIwMsUORdAL2oi4E2+f1kHetAjglqaLNiXo6E+J10SLBwCjZHW9rqa8Sz2tSXjiYD7iyLwRBA1HinI+QDcHqedItl0wV0jX4fV0PtgOh1+t0bfx3Ouigqj9X1kwWKAWZAHJDKQAkCJkyUAnqQqVhYWFrLmMF9cgLRjo5FIBFpaWsDpdEIxgQ82GAzC9PR0+jT94xGY6wjrfg4/CoCPWjkgN5zLoUAabijx0+Ip/JA8U39QDBEdE5Bc8sUV4CQSiUQiMcZfkEgV/zQ/29gAAAAASUVORK5CYII="
                    }
                ]
            },
            {
                type: "RowLayout",
                padding: 4,
                columnSize: "grow",
                grow: 1,
                children: [
                    {
                        type: "Text",
                        fontColor: isDarkMode ? "#579BF9" : "#146FF4",
                        content: getDisplayName(_values)
                    }
                ]
            }
        ]
    };
    const optionCustomContent: PreviewProps = {
        type: "RowLayout",
        columnSize: "fixed",
        borders: true,
        children: [
            {
                type: "DropZone",
                property: _values.optionCustomContent,
                placeholder: "Place your custom option content here"
            }
        ]
    };

    const referenceSetValueContent: PreviewProps = {
        type: "RowLayout",
        columnSize: "fixed",
        borders: true,
        children: [
            {
                type: "DropZone",
                property: _values.referenceSetValueContent,
                placeholder: "Place your custom badge/comma content here"
            }
        ]
    };

    const menuFooterContent: PreviewProps = {
        type: "RowLayout",
        columnSize: "fixed",
        borders: true,
        children: [
            {
                type: "DropZone",
                property: _values.footerContent,
                placeholder: "Place your menu footer content here"
            }
        ]
    };

    return {
        type: "Container",
        children: [
            mainContent,
            ...(_values.optionTextType === "custom" ? [optionCustomContent] : []),
            ...(_values.referenceSetValue === "CUSTOM" ? [referenceSetValueContent] : []),
            ...(_values.showFooter ? [menuFooterContent] : [])
        ]
    };
};

export function getCustomCaption(_values: SearchableReferenceSelectorMxNinePreviewProps): string {
    return "Searchable Selector: " + getDisplayName(_values);
}
