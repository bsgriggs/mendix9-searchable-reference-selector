import { createElement, ReactNode, forwardRef } from "react";

interface OptionProps {
    key: number;
    isSelected: boolean;
    isSelectable: boolean;
    onSelect: () => void;
    children: ReactNode;
}

const Option = forwardRef<HTMLDivElement, OptionProps>((props: OptionProps, ref) => (
    <div
        key={props.key}
        role="option"
        aria-selected={props.isSelected ? "true" : "false"}
        tabIndex={props.key}
        className={props.isSelected ? "srs-option selected" : "srs-option"}
        onClick={props.onSelect}
        ref={ref}
    >
        {props.children}
    </div>
));

export default Option;
