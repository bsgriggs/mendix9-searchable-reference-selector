import { createElement, ReactNode } from "react";

interface OptionProps {
    key: number;
    isSelected: boolean;
    isSelectable: boolean;
    onSelect: () => void;
    children: ReactNode;
}

const Option = (props: OptionProps): JSX.Element => {
    return (
        <div
            key={props.key}
            role="option"
            aria-selected={props.isSelected ? "true" : "false"}
            tabIndex={props.key}
            className={props.isSelected ? "srs-option selected" : "srs-option"}
            onClick={props.onSelect}
        >
            {props.children}
        </div>
    );
};

export default Option;
