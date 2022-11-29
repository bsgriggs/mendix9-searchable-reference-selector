import { ObjectItem, ListAttributeValue } from "mendix";
import { KeyboardEvent } from "react";

export default function handleKeyNavigation(
    event: KeyboardEvent<HTMLDivElement>,
    focusedObjIndex: number,
    setFocusedObjIndex: (newIndex: number) => void,
    selectableObjects: ObjectItem[],
    onSelectHandler: (selectedObj: ObjectItem, closeMenu?: boolean) => void,
    selectableAttribute: ListAttributeValue<boolean> | undefined,
    setShowMenu?: (newShowMenu: boolean) => void
): void {
    const keyPressed = event.key;
    if (keyPressed === "ArrowUp" || keyPressed === "ArrowLeft") {
        if (focusedObjIndex === -1) {
            setFocusedObjIndex(0);
        } else if (focusedObjIndex > 0) {
            setFocusedObjIndex(focusedObjIndex - 1);
        } else {
            setFocusedObjIndex(selectableObjects.length - 1);
        }
        if (setShowMenu !== undefined) {
            setShowMenu(true);
        }
    } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
        if (focusedObjIndex === -1) {
            setFocusedObjIndex(0);
        } else if (focusedObjIndex < selectableObjects.length - 1) {
            setFocusedObjIndex(focusedObjIndex + 1);
        } else {
            setFocusedObjIndex(0);
        }
        if (setShowMenu !== undefined) {
            setShowMenu(true);
        }
    } else if (keyPressed === "Enter") {
        if (focusedObjIndex > -1) {
            const currentSelectedObj = selectableObjects[focusedObjIndex];
            if (selectableAttribute === undefined || selectableAttribute?.get(currentSelectedObj).value) {
                onSelectHandler(selectableObjects[focusedObjIndex], true);
            }
        }
    } else if (keyPressed === "Escape" || keyPressed === "Tab") {
        setFocusedObjIndex(-1);
        if (setShowMenu !== undefined) {
            setShowMenu(true);
        }
    }
}
