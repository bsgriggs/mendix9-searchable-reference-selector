import React, { createElement, ReactNode, useState, useRef, useEffect } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import CancelIcon from "./CancelIcon";
import DropdownIcon from "./DropdownIcon";
import OptionsMenu from "./OptionsMenu";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import useOnClickOutside from "../custom hooks/useOnClickOutside";

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
    const [selectedObjIndex, setSelectedObjIndex] = useState<number>(-1);
    const searchInput = useRef<HTMLInputElement>(null);
    const srsRef = useRef(null);

    const focusSearchInput = () => {
        if (props.currentValue === undefined && searchInput.current !== null) {
            searchInput.current.focus();
        }
    };
    useEffect(() => {
        if (showPopup) {
            focusSearchInput();
        }
    }, [showPopup]);

    useEffect(() => {
        if (props.currentValue !== undefined) {
            setSelectedObjIndex(props.selectableObjects.findIndex(obj => obj.id === props.currentValue?.id));
        }
    }, [props.currentValue]);

    useOnClickOutside(srsRef, () => {
        // handle click outside
        setShowPopup(false);
        setSelectedObjIndex(props.selectableObjects.findIndex(obj => obj.id === props.currentValue?.id));
    });

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
        setShowPopup(false);
        setSearchText("");
    };

    const displayCurrentValue = (): ReactNode => {
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
        setSelectedObjIndex(0);
        if (value.trim() !== "" && showPopup === false) {
            toggleDropdown();
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setSearchText("");
            setShowPopup(false);
        }, 300);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const keyPressed = event.key;
        if (keyPressed === "ArrowUp" || keyPressed === "ArrowLeft") {
            if (selectedObjIndex === -1) {
                setSelectedObjIndex(0);
            } else if (selectedObjIndex > 0) {
                setSelectedObjIndex(selectedObjIndex - 1);
            } else {
                setSelectedObjIndex(props.selectableObjects.length);
            }
            setShowPopup(true);
        } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
            if (selectedObjIndex === -1) {
                setSelectedObjIndex(0);
            } else if (selectedObjIndex < props.selectableObjects.length) {
                setSelectedObjIndex(selectedObjIndex + 1);
            } else {
                setSelectedObjIndex(0);
            }
            setShowPopup(true);
        } else if (keyPressed === "Enter") {
            if (selectedObjIndex > -1) {
                props.onSelectAssociation(props.selectableObjects[selectedObjIndex]);
            }
            setShowPopup(false);
        } else if (keyPressed === "Escape") {
            setSelectedObjIndex(props.selectableObjects.findIndex(obj => obj.id === props.currentValue?.id));
            setShowPopup(false);
        }
    };

    console.log("reference selector props", props);
    console.log("selected Obj Index", selectedObjIndex);

    return (
        <div
            className={showPopup ? "form-control active" : "form-control"}
            tabIndex={props.tabIndex}
            onClick={toggleDropdown}
            onKeyDown={handleInputKeyDown}
            ref={srsRef}
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
                    onBlur={handleInputBlur}
                ></input>
            )}
            {props.currentValue !== undefined && displayCurrentValue()}
            {props.isClearable && props.isReadOnly === false && (
                <div
                    className="srs-icon"
                    onClick={() =>
                        showPopup && props.currentValue === undefined ? setSearchText("") : onSelectHandler(undefined)
                    }
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
                    currentValue={props.selectableObjects[selectedObjIndex]}
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
