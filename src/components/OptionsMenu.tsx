import React, { createElement, ReactNode, useEffect, useRef, useState } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import Option, { focusModeEnum } from "./Option";
import { OptionTextTypeEnum, OptionsStyleEnum, SelectStyleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import Big from "big.js";

export interface position {
    x: number;
    y: number;
    w: number;
    h: number;
}

interface OptionsMenuProps {
    selectableObjects: ObjectItem[];
    currentValue?: ObjectItem | ObjectItem[];
    currentFocus?: ObjectItem;
    displayAttribute: ListAttributeValue<string | Big>;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectOption: (newObject: ObjectItem) => void;
    searchText?: string;
    noResultsText?: string;
    maxHeight?: string;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
    selectStyle: SelectStyleEnum;
    position?: position;
    isReadyOnly: boolean;
}

const OptionsMenu = (props: OptionsMenuProps): JSX.Element => {
    const selectedObjRef = useRef<HTMLDivElement>(null);
    const [focusMode, setFocusMode] = useState<focusModeEnum>(
        props.currentFocus !== undefined ? focusModeEnum.arrow : focusModeEnum.hover
    );

    // keep the selected item in view when using arrow keys
    useEffect(() => {
        if (selectedObjRef.current) {
            selectedObjRef.current.scrollIntoView({ block: "center" });
        }
        setFocusMode(focusModeEnum.arrow);
    }, [props.currentFocus]);

    const onSelectHandler = (selectedObj: ObjectItem): void => {
        props.onSelectOption(selectedObj);
    };

    const determineOptionContent = (objectItem: ObjectItem): ReactNode => {
        switch (props.optionTextType) {
            case "text":
                return <span>{props.displayAttribute.get(objectItem).value?.toString()}</span>;
            case "html":
                return (
                    <span
                        dangerouslySetInnerHTML={{
                            __html: `${props.displayAttribute.get(objectItem).value?.toString()}`
                        }}
                    ></span>
                );
            case "custom":
                return <span className="srs-text">{props.optionCustomContent?.get(objectItem)}</span>;
        }
    };

    const OptionsMenuStyle = (): React.CSSProperties => {
        if (props.selectStyle === "dropdown" && props.position !== undefined) {
            return {
                maxHeight: props.maxHeight ? props.maxHeight : "12.5em",
                top: props.position.h + props.position.y,
                width: props.position.w,
                left: props.position.x
            };
        } else {
            return {};
        }
    };

    return (
        <div
            className={`srs-${props.selectStyle}`}
            style={OptionsMenuStyle()}
            onMouseEnter={() => setFocusMode(focusModeEnum.hover)}
        >
            {props.selectableObjects !== undefined && props.selectableObjects.length > 0 && (
                <React.Fragment>
                    {props.selectableObjects.map((obj, key) => {
                        const isFocused = obj.id === props.currentFocus?.id;
                        const isSelected = props.currentValue
                            ? Array.isArray(props.currentValue)
                                ? props.currentValue.findIndex(v => obj.id === v.id) > -1
                                : obj.id === props.currentValue.id
                            : false;
                        return (
                            <div key={key} ref={isFocused ? selectedObjRef : undefined}>
                                <Option
                                    index={key}
                                    isSelected={isSelected}
                                    isFocused={focusMode === focusModeEnum.arrow ? isFocused : false}
                                    isSelectable={
                                        props.isReadyOnly
                                            ? false
                                            : props.selectableAttribute
                                            ? props.selectableAttribute.get(obj).value === true
                                            : true
                                    }
                                    onSelect={() => onSelectHandler(obj)}
                                    focusMode={focusMode}
                                    optionsStyle={props.optionsStyle}
                                >
                                    {determineOptionContent(obj)}
                                </Option>
                            </div>
                        );
                    })}
                    {props.moreResultsText && (
                        <div className="mx-text srs-infooption" role="option">
                            {props.moreResultsText}
                        </div>
                    )}
                </React.Fragment>
            )}
            {props.selectableObjects === undefined ||
                (props.selectableObjects.length === 0 && (
                    <div className="mx-text srs-infooption" role="option">
                        {props.noResultsText ? props.noResultsText : "No results found"}
                    </div>
                ))}
        </div>
    );
};

export default OptionsMenu;
