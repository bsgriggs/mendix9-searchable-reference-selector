import { createElement, CSSProperties, Fragment, ReactElement, useEffect, useRef, useState } from "react";
import Option from "./Option";
import { focusModeEnum, EnumOption } from "typings/general";
import { OptionsStyleSingleEnum, SelectStyleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import { Position } from "../../custom hooks/usePositionUpdate";

interface OptionsMenuProps {
    options: EnumOption[];
    currentValue: EnumOption | undefined;
    currentFocus: EnumOption | undefined;
    onSelectOption: (selectedEnum: string) => void;
    noResultsText: string;
    maxHeight?: string;
    optionsStyle: OptionsStyleSingleEnum;
    selectStyle: SelectStyleEnum;
    position?: Position;
    isReadyOnly: boolean;
}

const OptionsMenuStyle = (
    selectStyle: SelectStyleEnum,
    position: Position | undefined,
    maxHeight: string | undefined
): CSSProperties => {
    if (selectStyle === "dropdown" && position !== undefined) {
        const contentCloseToBottom = position.y > window.innerHeight * 0.7;
        return {
            maxHeight: maxHeight ? maxHeight : "15em",
            top: contentCloseToBottom ? "unset" : position.h + position.y,
            bottom: contentCloseToBottom ? window.innerHeight - position.y : "unset",
            width: position.w,
            left: position.x
        };
    } else {
        return {};
    }
};

const OptionsMenu = ({
    isReadyOnly,
    onSelectOption,
    options,
    optionsStyle,
    selectStyle,
    currentFocus,
    currentValue,
    maxHeight,
    noResultsText,
    position
}: OptionsMenuProps): ReactElement => {
    const selectedEnumRef = useRef<HTMLDivElement>(null);
    const [focusMode, setFocusMode] = useState<focusModeEnum>(
        currentFocus !== undefined ? focusModeEnum.arrow : focusModeEnum.hover
    );

    // keep the selected item in view when using arrow keys
    useEffect(() => {
        if (selectedEnumRef.current) {
            selectedEnumRef.current.scrollIntoView({ block: "center" });
        }
        setFocusMode(focusModeEnum.arrow);
    }, [currentFocus]);

    return (
        <div
            className={`srs-${selectStyle}`}
            style={OptionsMenuStyle(selectStyle, position, maxHeight)}
            onMouseEnter={() => setFocusMode(focusModeEnum.hover)}
        >
            {options !== undefined && options.length > 0 && (
                <Fragment>
                    {options.map((enumOption, key) => {
                        const isFocused = enumOption.name === currentFocus?.name;
                        return (
                            <div key={key} ref={isFocused ? selectedEnumRef : undefined}>
                                <Option
                                    index={key}
                                    isSelected={enumOption.name === currentValue?.name}
                                    isFocused={focusMode === focusModeEnum.arrow ? isFocused : false}
                                    isSelectable={isReadyOnly === false}
                                    onSelect={(newOption: string) => onSelectOption(newOption)}
                                    focusMode={focusMode}
                                    optionsStyle={optionsStyle}
                                    option={enumOption}
                                />
                            </div>
                        );
                    })}
                </Fragment>
            )}
            {options === undefined ||
                (options.length === 0 && (
                    <div className="mx-text srs-infooption" role="option">
                        {noResultsText ? noResultsText : "No results found"}
                    </div>
                ))}
        </div>
    );
};

export default OptionsMenu;
