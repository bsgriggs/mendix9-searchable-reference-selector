import { createElement, PropsWithChildren, ReactElement } from "react";
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

const Option = (props: PropsWithChildren<OptionProps>): ReactElement => {
    const [hoverRef, isHovered] = useHover<HTMLDivElement>();

    return (
        <div
            className={classNames(
                "srs-option",
                { "srs-checkbox": props.optionsStyle === "checkbox" },
                { "srs-radio": props.optionsStyle === "radio" },
                { selected: props.option.isSelected },
                {
                    focused:
                        (props.focusMode === focusModeEnum.arrow && props.isFocused) ||
                        (props.focusMode === focusModeEnum.hover && props.optionsStyle === "cell" && isHovered)
                },
                { disabled: !props.option.isSelectable }
            )}
            onClick={event => {
                event.stopPropagation();
                if (props.option.isSelectable) {
                    props.onSelect(props.option);
                }
            }}
            ref={hoverRef}
        >
            {props.option.content}
        </div>
    );
};

export default Option;
