import { createElement, PropsWithChildren, ReactElement, MouseEvent } from "react";
import useHover from "../custom hooks/useHover";
import { IOption } from "../../typings/option";
import { OptionsStyleSetEnum, OptionsStyleSingleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import { focusModeEnum } from "../../typings/general";
import classNames from "classnames";

interface OptionProps {
    onSelect: (selectedOption: IOption) => void;
    option: IOption;
    isFocused: boolean;
    focusMode: focusModeEnum;
    optionsStyle: OptionsStyleSetEnum | OptionsStyleSingleEnum;
}

const Option = ({
    onSelect,
    option,
    focusMode,
    isFocused,
    optionsStyle
}: PropsWithChildren<OptionProps>): ReactElement => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();

    return (
        <div
            className={classNames(
                "srs-option",
                { selected: optionsStyle === "cell" && option.isSelected },
                { disabled: !option.isSelectable },
                {
                    focused:
                        (focusMode === focusModeEnum.arrow && isFocused) ||
                        (focusMode === focusModeEnum.hover && optionsStyle === "cell" && isHovered)
                }
            )}
            role="option"
            aria-selected={option.isSelected ? "true" : "false"}
            aria-disabled={!option.isSelectable}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
                event.stopPropagation();
                if (option.isSelectable) {
                    onSelect(option);
                }
            }}
            ref={hoverRef}
        >
            {optionsStyle === "checkbox" && (
                <input
                    type={"checkbox"}
                    checked={option.isSelected}
                    disabled={!option.isSelectable}
                    tabIndex={-1}
                ></input>
            )}
            {optionsStyle === "radio" && (
                <input type={"radio"} checked={option.isSelected} disabled={!option.isSelectable} tabIndex={-1} />
            )}
            {option.content}
        </div>
    );
};

export default Option;
