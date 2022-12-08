import { EnumOption } from "../../../typings/general";
import { KeyboardEvent } from "react";

export default function handleKeyNavigation(
    event: KeyboardEvent<HTMLDivElement>,
    focusedEnumIndex: number,
    setFocusedEnumIndex: (newIndex: number) => void,
    options: EnumOption[],
    onSelectHandler: (selectedEnum: string, closeMenu?: boolean) => void,
    isReadOnly: boolean,
    setShowMenu?: (newShowMenu: boolean) => void
): void {
    if (!isReadOnly) {
        const keyPressed = event.key;
        if (keyPressed === "ArrowUp" || keyPressed === "ArrowLeft") {
            if (focusedEnumIndex === -1) {
                setFocusedEnumIndex(0);
            } else if (focusedEnumIndex > 0) {
                setFocusedEnumIndex(focusedEnumIndex - 1);
            } else {
                setFocusedEnumIndex(options.length - 1);
            }
            if (setShowMenu !== undefined) {
                setShowMenu(true);
            }
        } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
            if (focusedEnumIndex === -1) {
                setFocusedEnumIndex(0);
            } else if (focusedEnumIndex < options.length - 1) {
                setFocusedEnumIndex(focusedEnumIndex + 1);
            } else {
                setFocusedEnumIndex(0);
            }
            if (setShowMenu !== undefined) {
                setShowMenu(true);
            }
        } else if (keyPressed === "Enter") {
            if (focusedEnumIndex > -1) {
                onSelectHandler(options[focusedEnumIndex]?.name, true);
            }
        } else if (keyPressed === "Escape" || keyPressed === "Tab") {
            setFocusedEnumIndex(-1);
            if (setShowMenu !== undefined) {
                setShowMenu(false);
            }
        }
    }
}
