import { MouseEvent, RefObject } from "react";
import focusSearchInput from "./focusSearchInput";
import { ObjectItem } from "mendix";

export default function handleClear(
    event: MouseEvent<HTMLDivElement | HTMLSpanElement>,
    mxFilter: string,
    setMxFilter: (newFilter: string) => void,
    setFocusedObjIndex: (newIndex: number) => void,
    onSelectHandler: (selectedObj: ObjectItem | undefined, closeMenu?: boolean) => void,
    searchInput: RefObject<HTMLInputElement>,
    setShowMenu?: (newShowMenu: boolean) => void
): void {
    event.stopPropagation();
    if (setShowMenu !== undefined) {
        setShowMenu(true);
    }
    setMxFilter("");
    setFocusedObjIndex(-1);
    if (mxFilter.trim() === "") {
        onSelectHandler(undefined, false);
    }
    focusSearchInput(searchInput, 300);
}
