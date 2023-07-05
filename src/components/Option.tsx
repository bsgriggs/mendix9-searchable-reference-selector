import { createElement, PropsWithChildren, ReactElement, MouseEvent } from "react";
import useHover from "../custom hooks/useHover";
import { IOption } from "../../typings/option";
import { OptionsStyleSetEnum, OptionsStyleSingleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import { focusModeEnum } from "../../typings/general";

interface OptionProps {
    index: number;
    onSelect: (selectedOption: IOption) => void;
    option: IOption;
    isFocused: boolean;
    focusMode: focusModeEnum;
    optionsStyle: OptionsStyleSetEnum | OptionsStyleSingleEnum;
}

const Option = ({
    onSelect,
    option,
    index,
    focusMode,
    isFocused,
    optionsStyle
}: PropsWithChildren<OptionProps>): ReactElement => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();
    const determineClassName = (): string => {
        let className = "srs-option";
        if (optionsStyle === "cell" ? option.isSelected : false) {
            className = className + " selected";
        }
        if (!option.isSelectable) {
            className = className + " disabled";
        }
        if (focusMode === focusModeEnum.arrow ? isFocused : optionsStyle === "cell" ? isHovered : false) {
            className = className + " focused";
        }
        return className;
    };

    return (
        <div
            id={index.toString()}
            role="option"
            aria-selected={option.isSelected ? "true" : "false"}
            aria-disabled={!option.isSelectable}
            className={determineClassName()}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
                event.stopPropagation();
                if (option.isSelectable) {
                    onSelect(option);
                }
            }}
            ref={hoverRef}
        >
            {optionsStyle === "checkbox" && (
                <input type={"checkbox"} checked={option.isSelected} disabled={!option.isSelectable} tabIndex={-1}></input>
            )}
            {optionsStyle === "radio" && (
                <input type={"radio"} checked={option.isSelected} disabled={!option.isSelectable} tabIndex={-1}/>
            )}
            {option.content}
        </div>
    );
};

export default Option;
