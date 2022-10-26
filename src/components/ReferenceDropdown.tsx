import React, { createElement, useState, useRef, useEffect, ReactElement } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon } from "mendix";
import ClearIcon from "./icons/ClearIcon";
import DropdownIcon from "./icons/DropdownIcon";
import OptionsMenu, { position } from "./OptionsMenu";
import { OptionsStyleEnum, OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import Big from "big.js";
import displayContent from "src/utils/displayContent";

interface ReferenceDropdownProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    selectableObjects: ObjectItem[];
    currentValue?: ObjectItem;
    displayAttribute?: ListAttributeValue<string | Big>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectAssociation: (newObject: ObjectItem | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon?: DynamicValue<WebIcon>;
    dropdownIcon?: DynamicValue<WebIcon>;
    isSearchable: boolean;
    isReadOnly: boolean;
    maxHeight?: string;
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
}

const defaultPosition: position = { x: 0, y: 0, w: 0, h: 0 };

const ReferenceDropdown = (props: ReferenceDropdownProps): ReactElement => {
    const [showMenu, setShowMenu] = useState(false);
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const searchInput = useRef<HTMLInputElement>(null);
    const srsRef = useRef<HTMLDivElement>(null);
    const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(null);
    const [position, setPosition] = useState<position>(defaultPosition);

    const updatePosition = (): void => {
        if (srsRef.current !== null) {
            setPosition({
                x: srsRef.current.getBoundingClientRect().left,
                y: srsRef.current.getBoundingClientRect().top,
                w: srsRef.current.getBoundingClientRect().width,
                h: srsRef.current.getBoundingClientRect().height
            });
        }
    };

    useEffect(() => {
        if (srsRef.current !== null) {
            const observer = new ResizeObserver(updatePosition);
            observer.observe(srsRef.current);
            setResizeObserver(observer);

            // Find the nearest scroll container and add a listener to update the position
            let iteratorEle = srsRef.current.parentElement;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                if (iteratorEle !== null) {
                    iteratorEle = iteratorEle.parentElement;
                    if (
                        iteratorEle !== null &&
                        (iteratorEle?.style.overflowY === "scroll" ||
                            iteratorEle?.style.overflowY === "auto" ||
                            iteratorEle.className === "mx-scrollcontainer-wrapper")
                    ) {
                        iteratorEle.addEventListener("scroll", () => updatePosition());
                        break;
                    }
                } else {
                    break;
                }
            }
        }
        return () => {
            resizeObserver?.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const focusSearchInput = (): void => {
        if (props.currentValue === undefined && searchInput.current !== null) {
            searchInput.current.focus();
        }
    };

    // useEffect(() => {
    //     // Auto focus the input if the popup is open
    //     if (showMenu) {
    //         focusSearchInput();
    //     } else {
    //         // clear search text if the menu is closed
    //         props.setMxFilter("");
    //     }
    // }, [showMenu]);

    useOnClickOutside(srsRef, () => {
        // handle click outside
        setShowMenu(false);
        setFocusedObjIndex(-1);
    });

    const onSelectHandler = (selectedObj: ObjectItem | undefined, closeMenu: boolean): void => {
        if (props.currentValue?.id === selectedObj?.id && props.isClearable) {
            props.onSelectAssociation(undefined);
        } else {
            props.onSelectAssociation(selectedObj);
        }
        props.setMxFilter("");
        if (closeMenu) {
            setShowMenu(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        props.setMxFilter(value);
        setFocusedObjIndex(0);
        // make sure the dropdown is open if the user is typing
        if (value.trim() !== "" && showMenu === false) {
            setShowMenu(true);
        }
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
        const keyPressed = event.key;
        if (keyPressed === "ArrowUp" || keyPressed === "ArrowLeft") {
            if (focusedObjIndex === -1) {
                setFocusedObjIndex(0);
            } else if (focusedObjIndex > 0) {
                setFocusedObjIndex(focusedObjIndex - 1);
            } else {
                setFocusedObjIndex(props.selectableObjects.length - 1);
            }
            setShowMenu(true);
        } else if (keyPressed === "ArrowDown" || keyPressed === "ArrowRight") {
            if (focusedObjIndex === -1) {
                setFocusedObjIndex(0);
            } else if (focusedObjIndex < props.selectableObjects.length - 1) {
                setFocusedObjIndex(focusedObjIndex + 1);
            } else {
                setFocusedObjIndex(0);
            }
            setShowMenu(true);
        } else if (keyPressed === "Enter") {
            if (focusedObjIndex > -1) {
                const currentSelectedObj = props.selectableObjects[focusedObjIndex];
                if (
                    props.selectableAttribute === undefined ||
                    props.selectableAttribute?.get(currentSelectedObj).value
                ) {
                    onSelectHandler(props.selectableObjects[focusedObjIndex], true);
                }
            }
        } else if (keyPressed === "Escape" || keyPressed === "Tab") {
            setFocusedObjIndex(-1);
            setShowMenu(false);
        }
    };

    const handleClear = (event: React.MouseEvent<HTMLDivElement>): void => {
        event.stopPropagation();
        setShowMenu(true);
        props.setMxFilter("");
        setFocusedObjIndex(-1);
        if (props.mxFilter.trim() === "") {
            onSelectHandler(undefined, false);
        }
        setTimeout(() => focusSearchInput(), 300);
    };

    return (
        <div
            className={showMenu ? "form-control active" : "form-control"}
            tabIndex={props.tabIndex || 0}
            onClick={() => {
                setShowMenu(!showMenu);
                updatePosition();
                if (showMenu === false) {
                    setTimeout(() => focusSearchInput(), 300);
                }
            }}
            onKeyDown={handleInputKeyDown}
            ref={srsRef}
        >
            {props.currentValue === undefined && props.isReadOnly === false && props.isSearchable && (
                <input
                    className=""
                    name={props.name}
                    placeholder={props.placeholder}
                    type="text"
                    onChange={handleInputChange}
                    readOnly={props.isReadOnly}
                    value={props.mxFilter}
                    ref={searchInput}
                    onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                        if (showMenu) {
                            event.stopPropagation();
                        }
                    }}
                ></input>
            )}
            {props.currentValue === undefined && props.isSearchable === false && (
                <span className="srs-text">{props.placeholder}</span>
            )}
            {props.currentValue !== undefined &&
                displayContent(
                    props.currentValue,
                    props.optionTextType,
                    props.displayAttribute,
                    props.optionCustomContent,
                    "srs-text"
                )}
            <div className="srs-icon-row">
                {props.isClearable && props.isReadOnly === false && (
                    <ClearIcon onClick={handleClear} title={"Clear"} mxIconOverride={props.clearIcon} />
                )}
                <DropdownIcon mxIconOverride={props.dropdownIcon} />
            </div>
            {showMenu && (
                <OptionsMenu
                    selectableObjects={props.selectableObjects}
                    displayAttribute={props.displayAttribute}
                    onSelectOption={(newObject: ObjectItem | undefined) => {
                        const newObjSelectable =
                            newObject !== undefined && props.selectableAttribute !== undefined
                                ? props.selectableAttribute.get(newObject).value === true
                                : true;
                        onSelectHandler(newObject, newObjSelectable);
                    }}
                    currentValue={props.currentValue}
                    currentFocus={props.selectableObjects[focusedObjIndex]}
                    maxHeight={props.maxHeight}
                    searchText={props.mxFilter}
                    selectableAttribute={props.selectableAttribute}
                    noResultsText={props.noResultsText}
                    optionTextType={props.optionTextType}
                    optionCustomContent={props.optionCustomContent}
                    moreResultsText={props.moreResultsText}
                    optionsStyle={props.optionsStyle}
                    selectStyle={"dropdown"}
                    position={position}
                    isReadyOnly={props.isReadOnly}
                />
            )}
        </div>
    );
};

export default ReferenceDropdown;
