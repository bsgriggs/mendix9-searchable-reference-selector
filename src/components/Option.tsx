import { createElement, ReactNode } from "react";
import useHover from "src/custom hooks/useHover";
export enum focusModeEnum {
    hover= "hover",
    arrow ="arrow"
}

interface OptionProps {
    key: number;
    isSelected: boolean;
    isFocused: boolean;
    isSelectable: boolean;
    focusMode: focusModeEnum;
    onSelect: () => void;
    children: ReactNode;
}

const Option = (props: OptionProps) => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();
    const determineClassName = (): string => {
        let className = "srs-option";
        if (props.isSelected) {
            className = className + " selected";
        }
        if (props.isSelectable === false) {
            className = className + " disabled";
        }
        if (props.focusMode === focusModeEnum.arrow ? props.isFocused : isHovered) {
            className = className + " focused";
        }
        return className;
    };

    return (
        <div
            key={props.key}
            role="option"
            aria-selected={props.isSelected ? "true" : "false"}
            aria-disabled={props.isSelectable === false}
            tabIndex={props.key}
            className={determineClassName()}
            onClick={() => (props.isSelectable ? props.onSelect() : undefined)}
            ref={hoverRef}
        >
            {props.children}
        </div>
    );
};

export default Option;
