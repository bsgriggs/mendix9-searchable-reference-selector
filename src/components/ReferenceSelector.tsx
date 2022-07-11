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
    maxHeight?: string;
}

const ReferenceSelector = (props: ReferenceSelectorProps): JSX.Element => {
    const [showMenu, setShowMenu] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [selectableObjectList, setSelectableObjectList] = useState<ObjectItem[]>([]);
    const [selectedObjIndex, setSelectedObjIndex] = useState<number>(-1);
    const searchInput = useRef<HTMLInputElement>(null);
    const srsRef = useRef(null);

    const focusSearchInput = () => {
        if (props.currentValue === undefined && searchInput.current !== null) {
            searchInput.current.focus();
        }
    };

    useEffect(() => {
        //Auto focus the input if the popup is open
        console.log("useEffect - auto focus");
        if (showMenu) {
            focusSearchInput();
        } else{
            // clear search text if the menu is closed
            setSearchText("");
        }
    }, [showMenu]);

    useEffect(() => {
        //set selectable obj index
        console.log("useEffect - set selectable obj index")
        if (props.currentValue !== undefined) {
            setSelectedObjIndex(selectableObjectList.findIndex(obj => obj.id === props.currentValue?.id));
        }
    }, [props.currentValue]);

    useEffect(() => {
        // filter the selectable objects when the search text changes
        console.log("useEffect - filter")
        if (searchText !== undefined && searchText.trim().length > 0) {
            const searchTextTrimmed = searchText.trim();
            setSelectableObjectList(
                props.selectableObjects.filter(obj => {
                    const text = props.displayAttribute.get(obj).value;
                    return text !== undefined && text.toLowerCase().includes(searchTextTrimmed.toLowerCase());
                })
            );
        } else {
            setSelectableObjectList(props.selectableObjects);
        }
    }, [searchText]);

    const resetSelectedObjIndex = () => {
        console.log("reset selected obj index")
        const index = selectableObjectList.findIndex(obj => obj.id === props.currentValue?.id);
        setSelectedObjIndex(index);
    };

    useOnClickOutside(srsRef, () => {
        // handle click outside
        console.log("click outside");
        setShowMenu(false);
        resetSelectedObjIndex();
    });

    const onSelectHandler = (selectedObj: ObjectItem | undefined, closeMenu: boolean) => {
        console.log("onSelect handler", {selectedObj, closeMenu})
        props.onSelectAssociation(selectedObj);
        setSearchText("");
        if (closeMenu) {
            setShowMenu(false);
        }
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
        console.log("handle input change", value)
        setSearchText(value);
        setSelectedObjIndex(0);
        // make sure the dropdown is open if the user is typing
        if (value.trim() !== "" && showMenu === false) {
            setShowMenu(true);
        }
    };

    // const handleInputBlur = () => {
    //     console.log("handle input blur")
    //     setTimeout(() => {
    //         setSearchText("");
    //         setShowMenu(false);
    //     }, 300);
    // };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const keyPressed = event.key;
        console.log("key pressed", keyPressed)
        if (keyPressed === "ArrowUp" || keyPressed === "ArrowLeft") {
            if (selectedObjIndex === -1) {
                setSelectedObjIndex(0);
            } else if (selectedObjIndex > 0) {
                setSelectedObjIndex(selectedObjIndex - 1);
            } else {
                setSelectedObjIndex(selectableObjectList.length);
            }
            setShowMenu(true);
        } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
            if (selectedObjIndex === -1) {
                setSelectedObjIndex(0);
            } else if (selectedObjIndex < selectableObjectList.length) {
                setSelectedObjIndex(selectedObjIndex + 1);
            } else {
                setSelectedObjIndex(0);
            }
            setShowMenu(true);
        } else if (keyPressed === "Enter") {
            if (selectedObjIndex > -1) {
                const currentSelectedObj = selectableObjectList[selectedObjIndex];
                if (
                    props.selectableAttribute === undefined ||
                    props.selectableAttribute?.get(currentSelectedObj).value
                ) {
                    onSelectHandler(selectableObjectList[selectedObjIndex], true);
                }
            }
        } else if (keyPressed === "Escape" || keyPressed === "Tab") {
            resetSelectedObjIndex();
            setShowMenu(false);
        }
    };

    const handleClear = (event: React.MouseEvent<HTMLDivElement>) => {
        console.log("handleClear")
        event.stopPropagation();
        setShowMenu(true);
        setSearchText("");
        setSelectedObjIndex(-1);
        if (props.currentValue !== undefined) {
            onSelectHandler(undefined, false);
        }
        setTimeout(() => focusSearchInput(), 300);
    }

    return (
        <div
            className={showMenu ? "form-control active" : "form-control"}
            tabIndex={props.tabIndex || 0}
            onClick={() => {
                setShowMenu(!showMenu);
                if (showMenu === false) {
                    console.log("onClick - show menu")
                    setTimeout(() => focusSearchInput(), 300);
                }
            }}
            onKeyDown={handleInputKeyDown}
            ref={srsRef}
        >
            {props.currentValue === undefined && props.isReadOnly === false && (
                <input
                    className=""
                    name={props.name}
                    placeholder={props.placeholder}
                    type="text"
                    onChange={handleInputChange}
                    readOnly={props.isReadOnly}
                    value={searchText}
                    ref={searchInput}
                    // onBlur={handleInputBlur}
                ></input>
            )}
            {props.currentValue !== undefined && displayCurrentValue()}
            {props.isClearable && props.isReadOnly === false && (
                <div
                    className="srs-icon"
                    onClick={handleClear}
                >
                    <CancelIcon />
                </div>
            )}
            <div className="srs-icon">
                <DropdownIcon />
            </div>
            {showMenu && (
                <OptionsMenu
                    selectableObjects={selectableObjectList}
                    displayAttribute={props.displayAttribute}
                    onSelectOption={(newObject: ObjectItem | undefined) => {
                        const newObjSelectable =
                            newObject !== undefined && props.selectableAttribute !== undefined
                                ? props.selectableAttribute.get(newObject).value === true
                                : true;
                        onSelectHandler(newObject, newObjSelectable);
                    }}
                    currentValue={selectableObjectList[selectedObjIndex]}
                    maxHeight={props.maxHeight}
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
