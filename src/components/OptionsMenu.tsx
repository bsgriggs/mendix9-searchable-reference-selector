import React, { createElement, ReactNode, useEffect, useRef, useState } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import Option from "./Option";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";

interface OptionsMenuProps {
    selectableObjects: ObjectItem[];
    currentValue?: ObjectItem;
    displayAttribute: ListAttributeValue<string>;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectOption: (newObject: ObjectItem) => void;
    closeMenu: () => void;
    searchText?: string;
    noResultsText?: string;
    minHeight?: string;
    maxHeight?: string;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
}

const OptionsMenu = (props: OptionsMenuProps): JSX.Element => {
    // const [hoveredObject, setHoveredObject] = useState<ObjectItem | undefined>(props.currentValue);
    const ref = useRef(null);
    const [selectableObjectList, setSelectableObjectList] = useState<ObjectItem[]>();

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

    useOnClickOutside(ref, () => {
        // handle click outside
        props.closeMenu();
    });

    const onSelectHandler = (selectedObj: ObjectItem) => {
        props.onSelectOption(selectedObj);
        props.closeMenu();
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
        <div className="srs-dropdown" ref={ref}>
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
