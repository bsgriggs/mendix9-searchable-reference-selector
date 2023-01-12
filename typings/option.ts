import { ReactNode } from "react";
import { ObjectItem } from "mendix";

type enumOption = {
    selectionType: "enumeration";
    id: string;
};

type refOption = {
    selectionType: "reference";
    id: ObjectItem;
};

export type IOption = {
    isSelected: boolean;
    isSelectable: boolean;
    content: ReactNode;
} & (enumOption | refOption);
