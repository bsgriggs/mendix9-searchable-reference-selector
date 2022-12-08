import { ObjectItem } from "mendix";

export default function handleRemoveObj(
    removeObj: ObjectItem,
    setMxFilter: (newFilter: string) => void,
    onSelectAssociation: (newObjectList: ObjectItem[]) => void,
    currentValues: ObjectItem[]
): void {
    onSelectAssociation(currentValues.filter(obj => obj.id !== removeObj.id));
    setMxFilter("");
}
