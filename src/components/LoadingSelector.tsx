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
        <div className="srs">
            <div className={"form-control"} tabIndex={props.tabIndex || 0}>
                <input className="" name={props.name} placeholder={props.placeholder} type="text"></input>
                {props.isClearable && (
                    <div className="srs-icon">
                        <CancelIcon />
                    </div>
                )}
                <div className="srs-icon">
                    <DropdownIcon />
                </div>
            </div>
        </div>
    );
};

export default LoadingSelector;
