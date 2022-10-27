import { ReactElement, createElement } from "react";
import { SearchableReferenceSelectorMxNinePreviewProps } from "typings/SearchableReferenceSelectorMxNineProps";
import { WebIcon } from "mendix";
import { Icon } from "mendix/components/web/Icon";
import Option, { focusModeEnum } from "./components/Option";

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
    } else return undefined;
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

export function preview(props: SearchableReferenceSelectorMxNinePreviewProps): ReactElement {
    const lastPeriodIndex = props.association.lastIndexOf(".");
    const associationDisplay = props.association.substring(lastPeriodIndex + 1);
    const displayAttribute = "[" + associationDisplay + "/" + props.displayAttribute + "]";

    return (
        <div className="srs">
            <div className="form-control">
                {props.readOnly === false && props.isSearchable && (
                    <input type="text" readOnly={props.readOnly} value={displayAttribute}></input>
                )}
                {props.isSearchable === false && <span className="srs-text">{displayAttribute}</span>}
                <div className="srs-icon-row">
                    {props.showSelectAll && props.readOnly === false && displayIcon(props.selectAllIcon, "check")}
                    {props.isClearable && props.readOnly === false && displayIcon(props.clearIcon, "remove")}
                    {props.selectStyle === "dropdown" && displayIcon(props.dropdownIcon, "menu-down")}
                </div>
            </div>
            <div
                className={`srs-list`}
                style={{borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "#d7d7d7",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    padding: "0.25em"}}
            >
                <div>
                    <Option
                        index={1}
                        isSelected={true}
                        isFocused={false}
                        isSelectable={true}
                        onSelect={() => {}}
                        focusMode={focusModeEnum.hover}
                        optionsStyle={props.optionsStyle}
                    >
                        <span>{displayAttribute + " 1"}</span>
                    </Option>
                    <Option
                        index={2}
                        isSelected={false}
                        isFocused={false}
                        isSelectable={true}
                        onSelect={() => {}}
                        focusMode={focusModeEnum.hover}
                        optionsStyle={props.optionsStyle}
                    >
                        <span>{displayAttribute + " 2"}</span>
                    </Option>
                    <Option
                        index={3}
                        isSelected={false}
                        isFocused={false}
                        isSelectable={false}
                        onSelect={() => {}}
                        focusMode={focusModeEnum.hover}
                        optionsStyle={"cell"}
                    >
                        <span>{"..." + (props.maxItems !== "0" ? " up to " + props.maxItems : "")}</span>
                    </Option>
                </div>
            </div>
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/SearchableReferenceSelectorMxNine.css");
}
