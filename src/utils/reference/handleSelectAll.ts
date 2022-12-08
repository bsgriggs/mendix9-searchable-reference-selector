import { MouseEvent } from "react";
import { ObjectItem, ListAttributeValue } from "mendix";

export default function handleSelectAll(
    event: MouseEvent<HTMLSpanElement>,
    setMxFilter: (newFilter: string) => void,
    setFocusedObjIndex: (newIndex: number) => void,
    onSelectAssociation: (newObjectList: ObjectItem[]) => void,
    selectableObjects: ObjectItem[],
    selectableAttribute: ListAttributeValue<boolean> | undefined
): void {
    event.stopPropagation();
    setMxFilter("");
    setFocusedObjIndex(-1);
    onSelectAssociation(
        selectableObjects.filter(obj => (selectableAttribute ? selectableAttribute.get(obj).value === true : true))
    );
}
