import { createElement, PropsWithChildren, ReactElement, ReactNode, MouseEvent } from "react";
import useHover from "src/custom hooks/useHover";
import { OptionsStyleEnum } from "typings/SearchableReferenceSelectorMxNineProps";

export enum focusModeEnum {
    // eslint-disable-next-line no-unused-vars
    hover = "hover",
    // eslint-disable-next-line no-unused-vars
    arrow = "arrow"
}

interface OptionProps {
    index: number;
    isSelected: boolean;
    isFocused: boolean;
    isSelectable: boolean;
    focusMode: focusModeEnum;
    onSelect: () => void;
    optionsStyle: OptionsStyleEnum;
    children: ReactNode;
}

const Option = ({
    children,
    focusMode,
    index,
    isFocused,
    isSelectable,
    isSelected,
    onSelect,
    optionsStyle
}: PropsWithChildren<OptionProps>): ReactElement => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();
    const determineClassName = (): string => {
        let className = "srs-option";
        if (optionsStyle === "cell" ? isSelected : false) {
            className = className + " selected";
        }
        if (isSelectable === false) {
            className = className + " disabled";
        }
        if (focusMode === focusModeEnum.arrow ? isFocused : optionsStyle === "cell" ? isHovered : false) {
            className = className + " focused";
        }
        return className;
    };

    return (
        <div
            role="option"
            aria-selected={isSelected ? "true" : "false"}
            aria-disabled={isSelectable === false}
            tabIndex={index}
            className={determineClassName()}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
                event.stopPropagation();
                if (isSelectable) {
                    onSelect();
                }
            }}
            ref={hoverRef}
        >
            {optionsStyle === "checkbox" && (
                <input type={"checkbox"} checked={isSelected} disabled={!isSelectable}></input>
            )}
            {optionsStyle === "radio" && <input type={"radio"} checked={isSelected} disabled={!isSelectable} />}
            {children}
        </div>
    );
};

export default Option;
