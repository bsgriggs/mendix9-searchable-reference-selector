import { createElement, CSSProperties, Fragment, ReactElement, useEffect, useRef, useState, MouseEvent } from "react";
import Option from "./Option";
import { focusModeEnum } from "typings/general";
import {
    OptionsStyleSetEnum,
    OptionsStyleSingleEnum,
    SelectStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import { IOption } from "typings/option";

interface OptionMenuProps {
    options: IOption[];
    currentFocus: IOption | undefined;
    onSelect: (selectedOption: IOption) => void;
    onSelectMoreOptions: (() => void) | undefined;
    noResultsText: string;
    maxMenuHeight: string | undefined;
    moreResultsText: string | undefined;
    optionsStyle: OptionsStyleSetEnum | OptionsStyleSingleEnum;
    selectStyle: SelectStyleEnum;
    position?: ClientRect;
    hasMoreOptions: boolean;
    isLoading: boolean;
    allowLoadingSelect: boolean;
    loadingText: string;
}

const OptionMenuStyle = (
    selectStyle: SelectStyleEnum,
    position: ClientRect | undefined,
    maxMenuHeight: string | undefined
): CSSProperties => {
    if (selectStyle === "dropdown" && position !== undefined) {
        const contentCloseToBottom = position.y > window.innerHeight * 0.7;
        return {
            maxHeight: maxMenuHeight ? maxMenuHeight : "15em",
            top: contentCloseToBottom ? "unset" : position.height + position.y,
            bottom: contentCloseToBottom ? window.innerHeight - position.y : "unset",
            width: position.width,
            left: position.x
        };
    } else {
        return {};
    }
};

const OptionsMenu = ({
    options,
    onSelect,
    optionsStyle,
    selectStyle,
    currentFocus,
    maxMenuHeight,
    moreResultsText,
    noResultsText,
    position,
    onSelectMoreOptions,
    hasMoreOptions,
    isLoading,
    loadingText,
    allowLoadingSelect
}: OptionMenuProps): ReactElement => {
    const selectedObjRef = useRef<HTMLLIElement>(null);
    const [focusMode, setFocusMode] = useState<focusModeEnum>(
        currentFocus !== undefined ? focusModeEnum.arrow : focusModeEnum.hover
    );

    // keep the selected item in view when using arrow keys
    useEffect(() => {
        if (selectedObjRef.current) {
            selectedObjRef.current.scrollIntoView({ block: "center" });
        }
        setFocusMode(focusModeEnum.arrow);
    }, [currentFocus]);

    return (
        <ul
            className={`srs-${selectStyle} srs-menu${isLoading && !allowLoadingSelect ? " wait" : ""}`}
            style={OptionMenuStyle(selectStyle, position, maxMenuHeight)}
            onMouseEnter={() => setFocusMode(focusModeEnum.hover)}
        >
            {options.length > 0 ? (
                <Fragment>
                    {isLoading && (
                        <li className="mx-text srs-infooption disabled" role="option">
                            {loadingText}
                        </li>
                    )}
                    {options.map((option, key) => {
                        const isFocused = option.id === currentFocus?.id;
                        return (
                            <li key={key} ref={isFocused ? selectedObjRef : undefined}>
                                <Option
                                    index={key}
                                    isFocused={focusMode === focusModeEnum.arrow ? isFocused : false}
                                    onSelect={selectedOption => {
                                        if (allowLoadingSelect || !isLoading) {
                                            onSelect(selectedOption);
                                        }
                                    }}
                                    focusMode={focusMode}
                                    optionsStyle={optionsStyle}
                                    option={option}
                                />
                            </li>
                        );
                    })}
                    {hasMoreOptions && (
                        <li
                            className={
                                onSelectMoreOptions !== undefined && !isLoading
                                    ? "mx-text srs-infooption"
                                    : "mx-text srs-infooption disabled"
                            }
                            style={{ cursor: onSelectMoreOptions ? "pointer" : "default" }}
                            role="option"
                            onClick={(event: MouseEvent<HTMLLIElement>) => {
                                if ((allowLoadingSelect || !isLoading) && onSelectMoreOptions !== undefined) {
                                    event.stopPropagation();
                                    onSelectMoreOptions();
                                }
                            }}
                        >
                            {isLoading ? loadingText : moreResultsText}
                        </li>
                    )}
                </Fragment>
            ) : (
                <li className="mx-text srs-infooption disabled" role="option">
                    {isLoading ? loadingText : noResultsText ? noResultsText : "No results found"}
                </li>
            )}
        </ul>
    );
};

export default OptionsMenu;
