import { createElement } from "react";
import CancelIcon from "./CancelIcon";
import DropdownIcon from "./DropdownIcon";

interface LoadingSelectorProps {
    name: string;
    placeholder?: string;
    tabIndex?: number;
    isClearable: boolean;
}

const LoadingSelector = (props: LoadingSelectorProps): JSX.Element => {
    return (
        <div className="d-flex">
            <input name={props.name} tabIndex={props.tabIndex} placeholder={props.placeholder}></input>
            {props.isClearable && <CancelIcon />}
            <DropdownIcon />
        </div>
    );
};

export default LoadingSelector;
