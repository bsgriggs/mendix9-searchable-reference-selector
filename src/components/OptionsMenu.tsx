import React, { createElement, ReactNode, useEffect, useRef, useState } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import Option, { focusModeEnum } from "./Option";
import { OptionTextTypeEnum, OptionsStyleEnum } from "typings/SearchableReferenceSelectorMxNineProps";

interface OptionsMenuProps {
    selectableObjects: ObjectItem[];
    currentValue?: ObjectItem | ObjectItem[];
    currentFocus?: ObjectItem;
    displayAttribute: ListAttributeValue<string>;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectOption: ( newObject: ObjectItem) => void;
    searchText?: string;
    noResultsText?: string;
    maxHeight?: string;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
}

const OptionsMenu = (props: OptionsMenuProps): JSX.Element => {
    const selectedObjRef = useRef<HTMLDivElement>(null);
    const [focusMode, setFocusMode] = useState<focusModeEnum>(
        props.currentFocus !== undefined ? focusModeEnum.arrow : focusModeEnum.hover
    );

    // keep the selected item in view when using arrow keys
    useEffect(() => {
        selectedObjRef.current && selectedObjRef.current.scrollIntoView({ block: "center" });
        setFocusMode(focusModeEnum.arrow);
    }, [props.currentFocus]);

    const onSelectHandler = (selectedObj: ObjectItem) => {
        props.onSelectOption(selectedObj);
    };

    const determineOptionContent = (objectItem: ObjectItem): ReactNode => {
        switch (props.optionTextType) {
            case "text":
                return <span>{props.displayAttribute.get(objectItem).value}</span>;
            case "html":
                return (
                    <span
                        dangerouslySetInnerHTML={{ __html: `${props.displayAttribute.get(objectItem).value}` }}
                    ></span>
                );
            case "custom":
                return <span className="srs-text">{props.optionCustomContent?.get(objectItem)}</span>;
        }
    };

    return (
        <div
            className="srs-dropdown"
            style={{ maxHeight: props.maxHeight ? props.maxHeight : "12.5em" }}
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
                            <div ref={isFocused ? selectedObjRef : undefined}>
                                <Option
                                    key={key}
                                    isSelected={isSelected}
                                    isFocused={focusMode === focusModeEnum.arrow ? isFocused : false}
                                    isSelectable={
                                        props.selectableAttribute
                                            ? props.selectableAttribute.get(obj).value === true
                                            : true
                                    }
                                    onSelect={() => onSelectHandler(obj)}
                                    children={determineOptionContent(obj)}
                                    focusMode={focusMode}
                                    optionsStyle={props.optionsStyle}
                                />
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
