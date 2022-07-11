import { createElement, ReactNode, forwardRef } from "react";

interface OptionProps {
    key: number;
    isSelected: boolean;
    isSelectable: boolean;
    onSelect: () => void;
    children: ReactNode;
}



const Option = forwardRef<HTMLDivElement, OptionProps>((props: OptionProps, ref) => {
    const determineClassName = ():string => {
        let className = "srs-option";
        if (props.isSelected) {
            className = className + " selected";
        }
        if (props.isSelectable === false) {
            className = className + " disabled";
        }
        return className;    
    }

    return(
    <div
        key={props.key}
        role="option"
        aria-selected={props.isSelected ? "true" : "false"}
        aria-disabled={props.isSelectable === false}
        tabIndex={props.key}
        className={determineClassName()}
        onClick={() => props.isSelectable ? props.onSelect() : undefined}
        ref={ref}
    >
        {props.children}
    </div>
)});

export default Option;
