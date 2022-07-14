import { createElement } from "react";
import CancelIcon from "./icons/CancelIcon";
import DropdownIcon from "./icons/DropdownIcon";

interface LoadingSelectorProps {
    name: string;
    placeholder?: string;
    tabIndex?: number;
    isClearable: boolean;
}

const LoadingSelector = (props: LoadingSelectorProps): JSX.Element => {
    return (
        <div className="srs">
            <div className={"form-control"} tabIndex={props.tabIndex || 0}>
                <input className="" name={props.name} placeholder={props.placeholder} type="text"></input>
                {props.isClearable && <CancelIcon />}
                <DropdownIcon />
            </div>
        </div>
    );
};

export default LoadingSelector;
