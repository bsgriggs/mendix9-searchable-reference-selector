import { createElement, PropsWithChildren, ReactElement, MouseEvent } from "react";
import useHover from "src/custom hooks/useHover";
import { EnumOption, focusModeEnum } from "typings/general";
import { OptionsStyleSingleEnum } from "typings/SearchableReferenceSelectorMxNineProps";

interface OptionProps {
    index: number;
    isSelected: boolean;
    isFocused: boolean;
    isSelectable: boolean;
    focusMode: focusModeEnum;
    onSelect: (newOptionName: string) => void;
    optionsStyle: OptionsStyleSingleEnum;
    option: EnumOption;
}

const determineClassName = (
    optionsStyle: OptionsStyleSingleEnum,
    isSelected: boolean,
    isSelectable: boolean,
    isFocused: boolean,
    isHovered: boolean,
    focusMode: focusModeEnum
): string => {
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

const Option = ({
    focusMode,
    index,
    isFocused,
    isSelectable,
    isSelected,
    onSelect,
    optionsStyle,
    option
}: PropsWithChildren<OptionProps>): ReactElement => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();

    return (
        <div
            role="option"
            aria-selected={isSelected ? "true" : "false"}
            aria-disabled={isSelectable === false}
            tabIndex={index}
            className={determineClassName(optionsStyle, isSelected, isSelectable, isFocused, isHovered, focusMode)}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
                event.stopPropagation();
                if (isSelectable && isSelected === false) {
                    onSelect(option.name);
                }
            }}
            ref={hoverRef}
        >
            {optionsStyle === "radio" && <input type={"radio"} checked={isSelected} disabled={!isSelectable} />}
            <span className="mx-text">{option.caption}</span>
        </div>
    );
};

export default Option;
