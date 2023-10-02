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
                    ? _values.optionTextType !== "textTemplate"
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
                "isCompact"
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
                "enumAttribute",
                "referenceSet",
                "optionsStyleSet",
                "referenceSetValue",
                "referenceSetValueContent",
                "clearSearchOnSelect",
                "isCompact"
            ]);
            break;
        case "referenceSet":
            hidePropertiesIn(defaultProperties, _values, ["enumAttribute", "reference", "optionsStyleSingle"]);
            break;
    }

    switch (_values.filterType) {
        case "auto":
            hidePropertiesIn(defaultProperties, _values, [
                "searchText",
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
        case "textTemplate":
            hidePropertiesIn(defaultProperties, _values, ["optionCustomContent", "displayAttribute"]);
            break;
        case "custom":
            hidePropertiesIn(defaultProperties, _values, ["displayAttribute", "optionExpression"]);
            break;
    }

    if (_values.isSearchable === false) {
        hidePropertiesIn(defaultProperties, _values, ["searchAttributes"]);
    }

    if (parseInt(_values.maxItems) === 0) {
        hidePropertiesIn(defaultProperties, _values, ["moreResultsText"]);
    }

    // if (_values.referenceSetStyle === "commas") {
    //     hidePropertiesIn(defaultProperties, _values, ["onBadgeClick"]);
    // }

    if (!(_values.selectionType === "referenceSet" && _values.referenceSetStyle === "badges")) {
        hidePropertyIn(defaultProperties, _values, "badgeColor");
    }

    if (_values.selectStyle === "list") {
        hidePropertyIn(defaultProperties, _values, "dropdownIcon");
    }

    if (_values.referenceSetValue === "SAME") {
        hidePropertyIn(defaultProperties, _values, "referenceSetValueContent");
    }

    if (_values.isClearable === false) {
        hidePropertiesIn(defaultProperties, _values, ["clearIcon", "clearIconTitle"]);
    }

    if (_values.showSelectAll === false) {
        hidePropertiesIn(defaultProperties, _values, ["selectAllIcon", "selectAllIconTitle"]);
    }

    if (_values.isSearchable === false) {
        hidePropertiesIn(defaultProperties, _values, [
            "maxItems",
            "filterDelay",
            "moreResultsText",
            "filterDelay",
            "filterType",
            "filterFunction",
            "searchText",
            "hasMoreResultsManual",
            "clearSearchOnSelect"
        ]);
    }

    if (_values.isSearchable === false && _values.selectStyle === "list") {
        hidePropertiesIn(defaultProperties, _values, ["placeholder"]);
    }

    if (_values.maxReferenceDisplay !== null && _values.maxReferenceDisplay === 0) {
        hidePropertyIn(defaultProperties, _values, "onExtraClick");
    }

    return defaultProperties;
}

export function check(_values: SearchableReferenceSelectorMxNinePreviewProps): Problem[] {
    const errors: Problem[] = [];

    if (
        _values.isSearchable &&
        _values.selectionType !== "enumeration" &&
        _values.filterType === "auto" &&
        _values.searchAttributes.length === 0 &&
        (_values.optionTextType === "custom" || _values.optionTextType === "textTemplate")
    ) {
        errors.push({
            property: `searchAttributes`,
            message: `At least 1 search attribute is required`,
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

    return {
        type: "Container",
        children: [
            mainContent,
            ...(_values.optionTextType === "custom" ? [optionCustomContent] : []),
            ...(_values.referenceSetValue === "CUSTOM" ? [referenceSetValueContent] : [])
        ]
    };
};

export function getCustomCaption(_values: SearchableReferenceSelectorMxNinePreviewProps): string {
    return "Searchable Selector: " + getDisplayName(_values);
}
