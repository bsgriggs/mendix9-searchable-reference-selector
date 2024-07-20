/* eslint-disable */
import { ReactElement, ReactNode, createElement } from "react";
import { SearchableReferenceSelectorMxNinePreviewProps } from "typings/SearchableReferenceSelectorMxNineProps";
import Selector from "./components/Selector";
import { IOption } from "typings/option";
import { getDisplayName } from "./SearchableReferenceSelectorMxNine.editorConfig";
import { DefaultClearIcon, DefaultDropdownIcon, DefaultSelectAllIcon } from "./assets/icons";

export function preview(props: SearchableReferenceSelectorMxNinePreviewProps): ReactElement {
    const displayName = getDisplayName(props);
    const displayTextContent = (text: string): ReactNode => <span>{text}</span>;

    const options: IOption[] =
        props.selectionType === "boolean"
            ? [
                  {
                      id: true,
                      content: props.trueLabel,
                      isSelectable: true,
                      isSelected: true,
                      selectionType: "BOOLEAN"
                  },
                  {
                      id: false,
                      content: props.falseLabel,
                      isSelectable: true,
                      isSelected: false,
                      selectionType: "BOOLEAN"
                  }
              ]
            : [
                  {
                      id: "1",
                      content:
                          props.optionTextType === "custom" ? (
                              // @ts-ignore
                              <props.optionCustomContent.renderer caption="Place custom content here">
                                  <div style={{ width: "100%" }} />
                              </props.optionCustomContent.renderer>
                          ) : (
                              displayTextContent(displayName)
                          ),
                      isSelectable: true,
                      isSelected: true,
                      selectionType: "ENUMERATION"
                  },
                  {
                      id: "2",
                      content:
                          props.optionTextType === "custom" ? (
                              // @ts-ignore
                              <props.optionCustomContent.renderer caption="Place custom content here">
                                  <div style={{ width: "100%" }} />
                              </props.optionCustomContent.renderer>
                          ) : (
                              displayTextContent(displayName)
                          ),
                      isSelectable: true,
                      isSelected: false,
                      selectionType: "ENUMERATION"
                  },
                  {
                      id: "3",
                      content:
                          props.optionTextType === "custom" ? (
                              // @ts-ignore
                              <props.optionCustomContent.renderer caption="Place custom content here">
                                  <div style={{ width: "100%" }} />
                              </props.optionCustomContent.renderer>
                          ) : (
                              displayTextContent(displayName)
                          ),
                      isSelectable: false,
                      isSelected: false,
                      selectionType: "ENUMERATION"
                  }
              ];

    return (
        <div className="srs">
            <Selector
                {...props}
                id={""}
                name={""}
                tabIndex={0}
                ariaLabel={""}
                isSearchable={
                    props.selectionType === "boolean" || props.selectionType === "enumeration"
                        ? props.isSearchable
                        : props.filterMode !== "OFF"
                }
                placeholder={props.selectionType !== "boolean" ? props.placeholder : ""}
                isLoading={false}
                hasMoreOptions={
                    (props.selectionType === "reference" || props.selectionType === "referenceSet") &&
                    props.moreResultsText !== undefined
                }
                isClearable={props.selectionType !== "boolean" ? props.isClearable : false}
                isReadOnly={props.readOnly}
                maxMenuHeight={""}
                maxReferenceDisplay={props.maxReferenceDisplay || 0}
                options={options}
                optionsStyle={props.selectionType === "referenceSet" ? props.optionsStyleSet : props.optionsStyleSingle}
                selectStyle={"list"}
                clearIcon={{
                    webIcon:
                        props.clearIcon !== null && props.clearIcon
                            ? props.clearIcon.type === "image"
                                ? { type: "image", iconUrl: props.clearIcon.imageUrl }
                                : { type: "glyph", iconClass: props.clearIcon.iconClass }
                            : undefined,
                    default: DefaultClearIcon
                }}
                clearIconTitle={""}
                clearAllIcon={{
                    webIcon:
                        props.clearAllIcon !== null && props.clearAllIcon
                            ? props.clearAllIcon.type === "image"
                                ? { type: "image", iconUrl: props.clearAllIcon.imageUrl }
                                : { type: "glyph", iconClass: props.clearAllIcon.iconClass }
                            : undefined,
                    default: DefaultClearIcon
                }}
                clearAllIconTitle={""}
                dropdownIcon={{
                    webIcon:
                        props.dropdownIcon !== null && props.dropdownIcon
                            ? props.dropdownIcon.type === "image"
                                ? { type: "image", iconUrl: props.dropdownIcon.imageUrl }
                                : { type: "glyph", iconClass: props.dropdownIcon.iconClass }
                            : undefined,
                    default: DefaultDropdownIcon
                }}
                selectAllIcon={{
                    webIcon:
                        props.selectAllIcon !== null && props.selectAllIcon
                            ? props.selectAllIcon.type === "image"
                                ? { type: "image", iconUrl: props.selectAllIcon.imageUrl }
                                : { type: "glyph", iconClass: props.selectAllIcon.iconClass }
                            : undefined,
                    default: DefaultSelectAllIcon
                }}
                selectAllIconTitle=""
                currentValue={undefined}
                clearSearchOnSelect
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onLeave={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onEnter={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onSelect={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onSelectMoreOptions={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onBadgeClick={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onExtraClick={() => {}}
                mxFilter=""
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                setMxFilter={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                setShowMenu={() => {}}
                showMenu={true}
                ariaRequired={false}
                autoFocusIndex={-1}
            />
            {props.referenceSetValue === "CUSTOM" && (
                <div className="srs-badge">
                    {/* @ts-ignore */}
                    <props.referenceSetValueContent.renderer caption="The value displayed in the badge or comma">
                        <div style={{ width: "100%" }} />
                    </props.referenceSetValueContent.renderer>
                </div>
            )}
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/SearchableReferenceSelectorMxNine.scss");
}
