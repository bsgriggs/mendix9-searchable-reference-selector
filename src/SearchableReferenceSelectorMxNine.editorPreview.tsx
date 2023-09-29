/* eslint-disable */
import { ReactElement, ReactNode, createElement } from "react";
import { SearchableReferenceSelectorMxNinePreviewProps } from "typings/SearchableReferenceSelectorMxNineProps";
import Selector from "./components/Selector";
import { IOption } from "typings/option";
import { getDisplayName } from "./SearchableReferenceSelectorMxNine.editorConfig";

export function preview(props: SearchableReferenceSelectorMxNinePreviewProps): ReactElement {
    const displayName = getDisplayName(props);
    const displayTextContent = (text: string): ReactNode => <span>{text}</span>;

    const option1: IOption = {
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
    };
    const option2: IOption = {
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
    };
    const option3: IOption = {
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
    };

    return (
        <div className="srs">
            <Selector
                id={""}
                name={""}
                isLoading={false}
                loadingText={props.loadingText}
                allowLoadingSelect={props.allowLoadingSelect}
                hasMoreOptions={props.moreResultsText !== undefined}
                isClearable={props.isClearable}
                isReadOnly={props.readOnly}
                isSearchable={props.isSearchable}
                maxMenuHeight={""}
                maxReferenceDisplay={props.maxReferenceDisplay || 0}
                moreResultsText={props.moreResultsText}
                noResultsText={props.noResultsText}
                options={[option1, option2, option3]}
                optionsStyle={props.selectionType === "referenceSet" ? props.optionsStyleSet : props.optionsStyleSingle}
                badgeColor={props.badgeColor}
                placeholder={props.placeholder}
                referenceSetStyle={props.referenceSetStyle}
                selectStyle={"list"}
                selectionType={props.selectionType}
                showSelectAll={props.showSelectAll}
                isCompact={props.isCompact}
                clearIcon={
                    props.clearIcon !== null
                        ? props.clearIcon.type === "image"
                            ? { type: "image", iconUrl: props.clearIcon.imageUrl }
                            : { type: "glyph", iconClass: props.clearIcon.iconClass }
                        : undefined
                }
                clearIconTitle={""}
                dropdownIcon={
                    props.dropdownIcon !== null
                        ? props.dropdownIcon.type === "image"
                            ? { type: "image", iconUrl: props.dropdownIcon.imageUrl }
                            : { type: "glyph", iconClass: props.dropdownIcon.iconClass }
                        : undefined
                }
                selectAllIcon={
                    props.selectAllIcon !== null
                        ? props.selectAllIcon.type === "image"
                            ? { type: "image", iconUrl: props.selectAllIcon.imageUrl }
                            : { type: "glyph", iconClass: props.selectAllIcon.iconClass }
                        : undefined
                }
                selectAllIconTitle=""
                currentValue={props.selectionType === "referenceSet" ? option1 : undefined}
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
