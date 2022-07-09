import React, { createElement, ReactNode, useState, useRef, useEffect } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import CancelIcon from "./CancelIcon";
import DropdownIcon from "./DropdownIcon";
import OptionsMenu from "./OptionsMenu";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";

interface ReferenceSelectorProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    selectableObjects: ObjectItem[];
    currentValue?: ObjectItem;
    displayAttribute: ListAttributeValue<string>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectAssociation: (newObject: ObjectItem | undefined) => void;
    isClearable: boolean;
    isReadOnly: boolean;
    minHeight?: string;
    maxHeight?: string;
}

const ReferenceSelector = (props: ReferenceSelectorProps): JSX.Element => {
    const [showPopup, setShowPopup] = useState(false);
    const [searchText, setSearchText] = useState("");
    const searchInput = useRef<HTMLInputElement>(null);

    const focusSearchInput = () => {
        if (props.currentValue === undefined && searchInput.current !== null) {
            searchInput.current.focus();
        }
    };
    useEffect(() => {
        focusSearchInput();
    }, []);

    const toggleDropdown = () => {
        if (props.isReadOnly === false) {
            setShowPopup(!showPopup);
        }
        if (showPopup === false) {
            // about to be set true, focus the input
            setTimeout(() => focusSearchInput(), 300);
        }
    };

    const onSelectHandler = (selectedObj: ObjectItem | undefined) => {
        props.onSelectAssociation(selectedObj);
    };

    const determineCurrentValue = (): ReactNode => {
        if (props.currentValue !== undefined) {
            switch (props.optionTextType) {
                case "text":
                    return <span className="srs-text">{props.displayAttribute.get(props.currentValue).value}</span>;
                case "html":
                    return (
                        <span
                            className="srs-text"
                            dangerouslySetInnerHTML={{
                                __html: `${props.displayAttribute.get(props.currentValue).value}`
                            }}
                        ></span>
                    );
                case "custom":
                    return <span className="srs-text">{props.optionCustomContent?.get(props.currentValue)}</span>;
            }
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchText(value);
        if (value.trim() !== "" && showPopup === false) {
            toggleDropdown();
        }
    };

    return (
        <div
            className={showPopup ? "form-control active" : "form-control"}
            tabIndex={props.tabIndex}
            onClick={toggleDropdown}
        >
            {props.currentValue === undefined && (
                <input
                    className=""
                    name={props.name}
                    placeholder={props.placeholder}
                    type="text"
                    onChange={handleInputChange}
                    readOnly={props.isReadOnly}
                    value={searchText}
                    ref={searchInput}
                    onBlur={() => {
                        setTimeout(() => {
                            setSearchText("");
                            setShowPopup(false);
                        }, 300);
                    }}
                ></input>
            )}
            {props.currentValue !== undefined && determineCurrentValue()}
            {props.isClearable && props.isReadOnly === false && (
                <div
                    className="srs-icon"
                    onClick={() => {
                        onSelectHandler(undefined);
                        focusSearchInput();
                    }}
                >
                    <CancelIcon />
                </div>
            )}
            <div className="srs-icon">
                <DropdownIcon />
            </div>
            {showPopup && (
                <OptionsMenu
                    selectableObjects={props.selectableObjects}
                    displayAttribute={props.displayAttribute}
                    onSelectOption={(newObject: ObjectItem | undefined) => onSelectHandler(newObject)}
                    closeMenu={() => setShowPopup(false)}
                    currentValue={props.currentValue}
                    maxHeight={props.maxHeight}
                    minHeight={props.minHeight}
                    searchText={searchText}
                    selectableAttribute={props.selectableAttribute}
                    noResultsText={props.noResultsText}
                    optionTextType={props.optionTextType}
                    optionCustomContent={props.optionCustomContent}
                />
            )}
        </div>
    );
};

export default ReferenceSelector;
