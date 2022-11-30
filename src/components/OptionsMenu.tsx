import React, { createElement, ReactElement, useEffect, useRef, useState } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import Option, { focusModeEnum } from "./Option";
import { OptionTextTypeEnum, OptionsStyleEnum, SelectStyleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import displayContent from "src/utils/displayContent";
import { Position } from "../custom hooks/usePositionUpdate";
// import Spinner from "./Spinner";

interface OptionsMenuProps {
    selectableObjects: ObjectItem[] | undefined;
    currentValue?: ObjectItem | ObjectItem[];
    currentFocus?: ObjectItem;
    displayAttribute?: ListAttributeValue<string>;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectOption: (newObject: ObjectItem) => void;
    noResultsText?: string;
    maxHeight?: string;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
    selectStyle: SelectStyleEnum;
    position?: Position;
    isReadyOnly: boolean;
    // isLoading: boolean;
}

const OptionsMenuStyle = (
    selectStyle: SelectStyleEnum,
    position: Position | undefined,
    maxHeight: string | undefined
): React.CSSProperties => {
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
    selectableAttribute
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
                <React.Fragment>
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
                                            : selectableAttribute
                                            ? selectableAttribute.get(obj).value === true
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
                        <div className="mx-text srs-infooption" role="option">
                            {moreResultsText}
                        </div>
                    )}
                </React.Fragment>
            )}
            {selectableObjects === undefined ||
                (selectableObjects !== undefined && selectableObjects.length === 0 && (
                    <div className="mx-text srs-infooption" role="option">
                        {noResultsText ? noResultsText : "No results found"}
                    </div>
                ))}
            {/* {isLoading && (
                    <Spinner size="2em" color="#264ae5"/>
                )} */}
        </div>
    );
};

export default OptionsMenu;
