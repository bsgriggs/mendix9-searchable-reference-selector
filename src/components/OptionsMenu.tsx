import React, { createElement, ReactNode, useEffect, useRef } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import Option from "./Option";

import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";

interface OptionsMenuProps {
    selectableObjects: ObjectItem[];
    currentValue?: ObjectItem;
    displayAttribute: ListAttributeValue<string>;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectOption: (newObject: ObjectItem) => void;
    searchText?: string;
    noResultsText?: string;
    maxHeight?: string;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
}

const OptionsMenu = (props: OptionsMenuProps): JSX.Element => {
    const selectedObjRef = useRef<HTMLDivElement>(null);

    // keep the selected item in view when using arrow keys
    useEffect(() => {
        selectedObjRef.current && selectedObjRef.current.scrollIntoView({ block: "center" });
    }, [props.currentValue]);

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
        <div className="srs-dropdown" style={{maxHeight: props.maxHeight ? props.maxHeight : "12.5em"}}>
            {props.selectableObjects !== undefined && props.selectableObjects.length > 0 && (
                <React.Fragment>
                    {props.selectableObjects.map((obj, key) => {
                        const isSelected = obj === props.currentValue;
                        return (
                            <Option
                                key={key}
                                isSelected={isSelected}
                                isSelectable={
                                    props.selectableAttribute ? props.selectableAttribute.get(obj).value === true : true
                                }
                                onSelect={() => onSelectHandler(obj)}
                                children={determineOptionContent(obj)}
                                ref={isSelected ? selectedObjRef : undefined}
                            />
                        );
                    })}
                </React.Fragment>
            )}
            {props.selectableObjects === undefined ||
                (props.selectableObjects.length === 0 && (
                    <div className="mx-text srs-noresult" role="option">{props.noResultsText ? props.noResultsText : "No results found"}</div>
                ))}
        </div>
    );
};

export default OptionsMenu;
