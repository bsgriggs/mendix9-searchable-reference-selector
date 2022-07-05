import { createElement } from "react";
import Select, {SingleValue, ActionMeta} from "react-select";
import {ObjectItem} from "mendix";

interface ReferenceSelectorProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    currentValue: ObjectItem;
    selectableObjects: ObjectItem[];
    allowEmptySelection: boolean;
    isReadOnly: boolean;
    isSearchable: boolean;
    isRightAligned: boolean;
    minHeight: number;
    maxHeight: number;

    onSelectHandler: (newValue: SingleValue<ObjectItem>, actionMeta: ActionMeta<ObjectItem>) => void;
    getLabel: (objectItem: ObjectItem) => string;
    getValue: (objectItem: ObjectItem) => string;
}

const ReferenceSelector = (props: ReferenceSelectorProps):JSX.Element => {
    return (
        <Select<ObjectItem>
            name={props.name}
            tabIndex={props.tabIndex}
            value={props.currentValue}
            isClearable={props.allowEmptySelection}
            onChange={props.onSelectHandler}
            options={props.selectableObjects}
            getOptionLabel={props.getLabel}
            getOptionValue={props.getValue}
            placeholder={props.placeholder}
            isDisabled={props.isReadOnly}
            isSearchable={props.isSearchable}
            isRtl={props.isRightAligned}
            minMenuHeight={
                props.minHeight > 0
                    ? props.minHeight
                    : undefined
            }
            maxMenuHeight={
                props.maxHeight > 0
                    ? props.maxHeight
                    : undefined
            }
            noOptionsMessage={() => props.noResultsText || undefined}
            className={"srs"}
            classNamePrefix={"srs"}
        />
    );
}

export default ReferenceSelector