import { createElement, CSSProperties, Fragment, ReactElement, useEffect, useRef, useState, MouseEvent } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, ListExpressionValue } from "mendix";
import Option from "./Option";
import { focusModeEnum } from "typings/general";
import {
    OptionTextTypeEnum,
    OptionsStyleSetEnum,
    OptionsStyleSingleEnum,
    SelectStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import displayContent from "src/utils/reference/displayContent";
import { Position } from "../../custom hooks/usePositionUpdate";

interface OptionsMenuProps {
    selectableObjects: ObjectItem[] | undefined;
    currentValue: ObjectItem | ObjectItem[] | undefined;
    currentFocus: ObjectItem | undefined;
    displayAttribute: ListAttributeValue<string>;
    selectableCondition: ListExpressionValue<boolean> | undefined;
    onSelectOption: (newObject: ObjectItem) => void;
    onSelectMoreOptions: (() => void) | undefined;
    noResultsText: string;
    maxHeight?: string;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent: ListWidgetValue | undefined;
    moreResultsText: string | undefined;
    optionsStyle: OptionsStyleSetEnum | OptionsStyleSingleEnum;
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
    // isLoading,
    isReadyOnly,
    onSelectOption,
    optionTextType,
    optionsStyle,
    selectStyle,
    selectableObjects,
    currentFocus,
    currentValue,
    displayAttribute,
    maxHeight,
    moreResultsText,
    noResultsText,
    optionCustomContent,
    position,
    selectableCondition,
    onSelectMoreOptions
}: OptionsMenuProps): ReactElement => {
    const selectedObjRef = useRef<HTMLDivElement>(null);
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
        <div
            className={`srs-${selectStyle}`}
            style={OptionsMenuStyle(selectStyle, position, maxHeight)}
            onMouseEnter={() => setFocusMode(focusModeEnum.hover)}
        >
            {selectableObjects !== undefined && selectableObjects.length > 0 && (
                <Fragment>
                    {selectableObjects.map((obj, key) => {
                        const isFocused = obj.id === currentFocus?.id;
                        const isSelected = currentValue
                            ? Array.isArray(currentValue)
                                ? currentValue.findIndex(v => obj.id === v.id) > -1
                                : obj.id === currentValue.id
                            : false;
                        return (
                            <div key={key} ref={isFocused ? selectedObjRef : undefined}>
                                <Option
                                    index={key}
                                    isSelected={isSelected}
                                    isFocused={focusMode === focusModeEnum.arrow ? isFocused : false}
                                    isSelectable={
                                        isReadyOnly
                                            ? false
                                            : selectableCondition
                                            ? selectableCondition.get(obj).value === true
                                            : true
                                    }
                                    onSelect={() => onSelectOption(obj)}
                                    focusMode={focusMode}
                                    optionsStyle={optionsStyle}
                                >
                                    {displayContent(obj, optionTextType, displayAttribute, optionCustomContent)}
                                </Option>
                            </div>
                        );
                    })}
                    {moreResultsText && (
                        <div
                            className={
                                onSelectMoreOptions !== undefined
                                    ? "mx-text srs-infooption"
                                    : "mx-text srs-infooption disabled"
                            }
                            role="option"
                            onClick={(event: MouseEvent<HTMLDivElement>) => {
                                if (onSelectMoreOptions !== undefined){
                                    event.stopPropagation();
                                    onSelectMoreOptions();
                                }
                            }}
                        >
                            {moreResultsText}
                        </div>
                    )}
                </Fragment>
            )}
            {selectableObjects === undefined ||
                (selectableObjects !== undefined && selectableObjects.length === 0 && (
                    <div className="mx-text srs-infooption disabled" role="option">
                        {noResultsText ? noResultsText : "No results found"}
                    </div>
                ))}
        </div>
    );
};

export default OptionsMenu;
