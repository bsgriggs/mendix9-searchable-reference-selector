import { createElement } from "react";
import Select from "react-select";

const ReferenceSetSelector = props => {
    return (
        <Select
            isMulti
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
            minMenuHeight={props.minHeight > 0 ? props.minHeight : undefined}
            maxMenuHeight={props.maxHeight > 0 ? props.maxHeight : undefined}
            noOptionsMessage={() => props.noResultsText || undefined}
            className={"srss"}
            classNamePrefix={"srss"}
        />
    );
};

export default ReferenceSetSelector;
