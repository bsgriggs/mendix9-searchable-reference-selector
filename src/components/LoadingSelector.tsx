import { createElement, ReactElement } from "react";
import { DynamicValue, WebIcon } from "mendix";
import CancelIcon from "./icons/ClearIcon";
import DropdownIcon from "./icons/DropdownIcon";

interface LoadingSelectorProps {
    name: string;
    placeholder?: string;
    tabIndex?: number;
    isClearable: boolean;
    clearIcon?: DynamicValue<WebIcon>;
    dropdownIcon?: DynamicValue<WebIcon>;
}

const LoadingSelector = (props: LoadingSelectorProps): ReactElement => {
    return (
        <div className="srs">
            <div className={"form-control"} tabIndex={props.tabIndex || 0}>
                <input className="" name={props.name} placeholder={props.placeholder} type="text"></input>
                {props.isClearable && <CancelIcon mxIconOverride={props.clearIcon} />}
                <DropdownIcon mxIconOverride={props.dropdownIcon} />
            </div>
        </div>
    );
};

export default LoadingSelector;
