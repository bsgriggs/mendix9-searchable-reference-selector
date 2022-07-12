import { createElement, ReactNode } from "react";
import useHover from "src/custom hooks/useHover";
import { OptionsStyleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
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
    optionsStyle: OptionsStyleEnum;
    children: ReactNode;
}

const Option = (props: OptionProps) => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();
    const determineClassName = (): string => {
        let className = "srs-option";
        if (props.optionsStyle === "cell" ? props.isSelected: false) {
            className = className + " selected";
        }
        if (props.isSelectable === false) {
            className = className + " disabled";
        }
        if (props.focusMode === focusModeEnum.arrow ? props.isFocused : props.optionsStyle === "cell" ? isHovered: false) {
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
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                event.stopPropagation();
                props.isSelectable ? props.onSelect() : undefined;
            }}
            ref={hoverRef}
        >
            {props.optionsStyle === "checkbox" && 
                <input type={"checkbox"} checked={props.isSelected} disabled={!props.isSelectable}></input>
            }
            {props.children}
        </div>
    );
};

export default Option;
