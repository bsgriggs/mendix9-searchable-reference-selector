import { KeyboardEvent } from "react";
import { IOption } from "typings/option";

export default function handleKeyNavigation(
    event: KeyboardEvent<HTMLDivElement>,
    focusedObjIndex: number,
    setFocusedObjIndex: (newIndex: number) => void,
    options: IOption[],
    onSelect: (selectedObj: IOption) => void,
    closeOnSelect: boolean,
    isReadOnly: boolean,
    setShowMenu: (newShowMenu: boolean) => void,
    updatePosition: () => void
): void {
    if (!isReadOnly) {
        const keyPressed = event.key;
        console.log("key", keyPressed);
        if (keyPressed === "ArrowUp" || keyPressed === "ArrowLeft") {
            if (focusedObjIndex === -1) {
                setFocusedObjIndex(0);
            } else if (focusedObjIndex > 0) {
                setFocusedObjIndex(focusedObjIndex - 1);
            } else {
                setFocusedObjIndex(options.length - 1);
            }
            if (updatePosition !== undefined) {
                updatePosition();
            }
            setShowMenu(true);
        } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
            if (focusedObjIndex === -1) {
                setFocusedObjIndex(0);
            } else if (focusedObjIndex < options.length - 1) {
                setFocusedObjIndex(focusedObjIndex + 1);
            } else {
                setFocusedObjIndex(0);
            }
            if (updatePosition !== undefined) {
                updatePosition();
            }
            setShowMenu(true);
        } else if (keyPressed === "Enter") {
            if (focusedObjIndex > -1) {
                const currentFocusedOption = options[focusedObjIndex];
                if (currentFocusedOption.isSelectable) {
                    onSelect(currentFocusedOption);
                }
                if (closeOnSelect) {
                    setShowMenu(false);
                }
            }
        } else if (keyPressed === "Escape" || keyPressed === "Tab") {
            setFocusedObjIndex(-1);
            setShowMenu(false);
        }
    }
}
