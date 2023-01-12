import { ReactElement, createElement } from "react";
import { SearchableReferenceSelectorMxNinePreviewProps } from "typings/SearchableReferenceSelectorMxNineProps";
import { displayTextContent } from "./utils/displayContent";
import Selector from "./components/Selector";
import { IOption } from "typings/option";

export function preview({
    reference,
    referenceSet,
    clearIcon,
    displayAttribute,
    dropdownIcon,
    enumAttribute,
    isClearable,
    isSearchable,
    optionsStyleSingle,
    readOnly,
    selectAllIcon,
    selectionType,
    showSelectAll,
    optionTextType,
    optionCustomContent,
    maxReferenceDisplay,
    moreResultsText,
    noResultsText,
    optionsStyleSet,
    placeholder,
    referenceSetStyle
}: SearchableReferenceSelectorMxNinePreviewProps): ReactElement {
    const lastPeriodIndex = selectionType === "reference" ? reference.lastIndexOf(".") : referenceSet.lastIndexOf(".");
    const associationDisplay =
        selectionType === "reference"
            ? reference.substring(lastPeriodIndex + 1)
            : referenceSet.substring(lastPeriodIndex + 1);
    const formattedDisplayAttribute =
        selectionType === "enumeration" ? enumAttribute : "[" + associationDisplay + "/" + displayAttribute + "]";

    const option1: IOption = {
        id: "1",
        content:
            optionTextType === "custom" ? (
                <optionCustomContent.renderer caption="Place custom content here">
                    <div style={{ width: "100%" }} />
                </optionCustomContent.renderer>
            ) : (
                displayTextContent(formattedDisplayAttribute)
            ),
        isSelectable: true,
        isSelected: true,
        selectionType: "enumeration"
    };
    const option2: IOption = {
        id: "2",
        content:
            optionTextType === "custom" ? (
                <optionCustomContent.renderer caption="Place custom content here">
                    <div style={{ width: "100%" }} />
                </optionCustomContent.renderer>
            ) : (
                displayTextContent(formattedDisplayAttribute)
            ),
        isSelectable: true,
        isSelected: false,
        selectionType: "enumeration"
    };
    const option3: IOption = {
        id: "3",
        content:
            optionTextType === "custom" ? (
                <optionCustomContent.renderer caption="Place custom content here">
                    <div style={{ width: "100%" }} />
                </optionCustomContent.renderer>
            ) : (
                displayTextContent(formattedDisplayAttribute)
            ),
        isSelectable: false,
        isSelected: false,
        selectionType: "enumeration"
    };

    return (
        <div className="srs">
            <Selector
                name=""
                hasMoreOptions={moreResultsText !== undefined}
                isClearable={isClearable}
                isReadOnly={readOnly}
                isSearchable={isSearchable}
                maxMenuHeight={""}
                maxReferenceDisplay={maxReferenceDisplay || 0}
                moreResultsText={moreResultsText}
                noResultsText={noResultsText}
                options={[option1, option2, option3]}
                optionsStyle={selectionType === "referenceSet" ? optionsStyleSet : optionsStyleSingle}
                placeholder={placeholder}
                referenceSetStyle={referenceSetStyle}
                searchFilter={""}
                selectStyle={"list"}
                selectionType={selectionType}
                showSelectAll={showSelectAll}
                srsRef={{ current: {} as HTMLDivElement }}
                clearIcon={
                    clearIcon !== null
                        ? clearIcon.type === "image"
                            ? { type: "image", iconUrl: clearIcon.imageUrl }
                            : { type: "glyph", iconClass: clearIcon.iconClass }
                        : undefined
                }
                dropdownIcon={
                    dropdownIcon !== null
                        ? dropdownIcon.type === "image"
                            ? { type: "image", iconUrl: dropdownIcon.imageUrl }
                            : { type: "glyph", iconClass: dropdownIcon.iconClass }
                        : undefined
                }
                selectAllIcon={
                    selectAllIcon !== null
                        ? selectAllIcon.type === "image"
                            ? { type: "image", iconUrl: selectAllIcon.imageUrl }
                            : { type: "glyph", iconClass: selectAllIcon.iconClass }
                        : undefined
                }
                currentValue={selectionType === "referenceSet" ? option1 : undefined}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onLeave={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onSelect={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onSelectMoreOptions={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                onBadgeClick={() => {}}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                setSearchFilter={() => {}}
            />
        </div>
    );
}

export function getPreviewCss(): string {
    return require("./ui/SearchableReferenceSelectorMxNine.css");
}
