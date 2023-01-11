import { MouseEvent } from "react";
import focusSearchInput from "../../utils/focusSearchInput";

export default function handleClearAll(
    event: MouseEvent<HTMLDivElement | HTMLSpanElement>,
    searchFilter: string,
    setSearchFilter: (newFilter: string) => void,
    setFocusedObjIndex: (newIndex: number) => void,
    onClear: () => void,
    searchInput: HTMLInputElement | null,
    setShowMenu: (newShowMenu: boolean) => void
): void {
    event.stopPropagation();
    setShowMenu(true);
    setSearchFilter("");
    setFocusedObjIndex(-1);
    if (searchFilter.trim() === "") {
        onClear();
    }
    focusSearchInput(searchInput, 300);
}
