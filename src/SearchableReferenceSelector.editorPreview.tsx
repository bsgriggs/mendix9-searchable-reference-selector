import { ReactElement, createElement } from "react";
// import SearchableReferenceSelectorComp from "./components/searchable-reference-selector";
// import { SearchableReferenceSelectorPreviewProps } from "../typings/SearchableReferenceSelectorProps";

// export function preview({
//     readOnly,
//     selectableObjects,
//     displayAttribute,
//     currentValue,
//     onSelect,
//     noneSelectedText,
//     requiredMessage
// }: SearchableReferenceSelectorPreviewProps): ReactElement {
//     return (
//         <SearchableReferenceSelectorComp
//             currentValue={currentValue}
//             tabIndex={0}
//             id={""}
//             selectableObjects={selectableObjects}
//             displayAttribute={displayAttribute}
//             noneSelectedText={""}
//         />
//     );
// }
export function preview(): ReactElement {
    return <div></div>;
}

export function getPreviewCss(): string {
    return require("./ui/SearchableReferenceSelector.css");
}
