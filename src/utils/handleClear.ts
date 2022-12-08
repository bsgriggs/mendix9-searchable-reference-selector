import { MouseEvent } from "react";
import focusSearchInput from "./focusSearchInput";

export default function handleClear(
    event: MouseEvent<HTMLDivElement | HTMLSpanElement>,
    mxFilter: string,
    setMxFilter: (newFilter: string) => void,
    setFocusedObjIndex: (newIndex: number) => void,
    onSelectHandler: (selectedObj: undefined, closeMenu?: boolean) => void,
    searchInput: HTMLInputElement | null,
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
