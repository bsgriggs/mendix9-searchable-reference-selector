import { ReactElement, createElement, Fragment } from "react";
import { SearchableReferenceSelectorMxNinePreviewProps } from "typings/SearchableReferenceSelectorMxNineProps";
import { WebIcon } from "mendix";
import { Icon } from "mendix/components/web/Icon";
import EnumOption from "./components/enum/Option";
import RefOption from "./components/reference/Option";
import { focusModeEnum } from "typings/general";

type iconPreview =
    | {
          type: "glyph";
          iconClass: string;
      }
    | {
          type: "image";
          imageUrl: string;
      }
    | null;

const formatWebIcon = (propsIcon: iconPreview): WebIcon | undefined => {
    if (propsIcon?.type === "glyph") {
        const glyphIcon = { type: propsIcon.type, iconClass: propsIcon.iconClass };
        return glyphIcon;
        // there seems to be a bug with Mendix that the image does not load via url
        // } else if (propsIcon?.type === "image") {
        //     const imgIcon = { type: propsIcon.type, iconUrl: propsIcon.imageUrl };
        //     return imgIcon;
    } else {
        return undefined;
    }
};

const displayIcon = (propsIcon: iconPreview, defaultClassName: string): ReactElement => {
    const webIcon = formatWebIcon(propsIcon);
    return propsIcon !== null && webIcon !== undefined ? (
        <div>
            <Icon icon={webIcon} />
        </div>
    ) : (
        <span className={"glyphicon glyphicon-" + defaultClassName} aria-hidden="true" />
    );
};

export function preview({
    reference,
    referenceSet,
    clearIcon,
    displayAttribute,
    dropdownIcon,
    enumAttribute,
    isClearable,
    isSearchable,
    maxItems,
    optionsStyleSet,
    optionsStyleSingle,
    readOnly,
    selectAllIcon,
    selectStyle,
    selectionType,
    showSelectAll
}: SearchableReferenceSelectorMxNinePreviewProps): ReactElement {
    const lastPeriodIndex = selectionType ==="reference" ? reference.lastIndexOf(".") : referenceSet.lastIndexOf(".");
    const associationDisplay = selectionType ==="reference" ? reference.substring(lastPeriodIndex + 1) : referenceSet.substring(lastPeriodIndex + 1);
    const formattedDisplayAttribute =
        selectionType === "enumeration" ? enumAttribute : "[" + associationDisplay + "/" + displayAttribute + "]";

    return (
        <div className="srs">
            <div className="form-control">
                {readOnly === false && isSearchable && (
                    <input type="text" readOnly={readOnly} value={formattedDisplayAttribute}></input>
                )}
                {isSearchable === false && <span className="srs-text">{formattedDisplayAttribute}</span>}
                <div className="srs-icon-row">
                    {showSelectAll && readOnly === false && displayIcon(selectAllIcon, "check")}
                    {isClearable && readOnly === false && displayIcon(clearIcon, "remove")}
                    {selectStyle === "dropdown" && displayIcon(dropdownIcon, "menu-down")}
                </div>
            </div>
            <div
                className={`srs-list`}
                style={{
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#d7d7d7",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    padding: "0.25em"
                }}
            >
                <div>
                    {selectionType === "enumeration" ? (
                        <Fragment>
                            <EnumOption
                                isSelected
                                isFocused={false}
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                onSelect={() => {}}
                                focusMode={focusModeEnum.hover}
                                optionsStyle={optionsStyleSingle}
                                option={{ caption: formattedDisplayAttribute + " 1", name: "1" }}
                                index={0}
                                isSelectable
                            />
                            <EnumOption
                                index={2}
                                isSelected={false}
                                isSelectable
                                isFocused={false}
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                onSelect={() => {}}
                                focusMode={focusModeEnum.hover}
                                optionsStyle={optionsStyleSingle}
                                option={{ caption: formattedDisplayAttribute + " 2", name: "2" }}
                            />
                        </Fragment>
                    ) : (
                        <Fragment>
                            <RefOption
                                index={1}
                                isSelected
                                isFocused={false}
                                isSelectable
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                onSelect={() => {}}
                                focusMode={focusModeEnum.hover}
                                optionsStyle={optionsStyleSet || optionsStyleSingle}
                            >
                                <span>{displayAttribute + " 1"}</span>
                            </RefOption>
                            <RefOption
                                index={2}
                                isSelected={false}
                                isFocused={false}
                                isSelectable
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                onSelect={() => {}}
                                focusMode={focusModeEnum.hover}
                                optionsStyle={optionsStyleSet || optionsStyleSingle}
                            >
                                <span>{displayAttribute + " 2"}</span>
                            </RefOption>
                            <RefOption
                                index={3}
                                isSelected={false}
                                isFocused={false}
                                isSelectable={false}
                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                onSelect={() => {}}
                                focusMode={focusModeEnum.hover}
                                optionsStyle={"cell"}
                            >
                                <span>{"..." + (maxItems !== "0" ? " up to " + maxItems : "")}</span>
                            </RefOption>
                        </Fragment>
                    )}
                </div>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/SearchableReferenceSelectorMxNine.css");
}
