import React, { createElement, ReactNode, useEffect, useRef, useState } from "react";
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
    minHeight?: string;
    maxHeight?: string;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
}

const OptionsMenu = (props: OptionsMenuProps): JSX.Element => {
    const [selectableObjectList, setSelectableObjectList] = useState<ObjectItem[]>();
    const selectedObjRef = useRef<HTMLDivElement>(null);

    // filter the selectable objects when the search text changes
    useEffect(() => {
        if (props.searchText !== undefined && props.searchText.trim().length > 0) {
            const searchText = props.searchText.trim();
            setSelectableObjectList(
                props.selectableObjects.filter(obj => {
                    const text = props.displayAttribute.get(obj).value;
                    return text !== undefined && text.toLowerCase().includes(searchText.toLowerCase());
                })
            );
        } else {
            setSelectableObjectList(props.selectableObjects);
        }
    }, [props.searchText]);

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

    console.log("options menu props", props);
    console.log("selected obj ref", selectedObjRef);

    return (
        <div className="srs-dropdown">
            {selectableObjectList !== undefined && selectableObjectList.length > 0 && (
                <React.Fragment>
                    {selectableObjectList.map((obj, key) => {
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
            {selectableObjectList === undefined ||
                (selectableObjectList.length === 0 && (
                    <span>{props.noResultsText ? props.noResultsText : "No results found"}</span>
                ))}
        </div>
    );
};

export default OptionsMenu;
