import React, { createElement, useState, useRef, useEffect } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import CancelIcon from "./icons/CancelIcon";
import DropdownIcon from "./icons/DropdownIcon";
import OptionsMenu from "./OptionsMenu";
import {
    OptionsStyleEnum,
    OptionTextTypeEnum,
    ReferenceSetStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import Badge from "./Badge";
import Comma from "./Comma";
import Big from "big.js";
import SelectAllIcon from "./icons/SelectAllIcon";

interface ReferenceSetDropdownProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    selectableObjects: ObjectItem[];
    currentValues: ObjectItem[];
    displayAttribute: ListAttributeValue<string | Big>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    selectableAttribute?: ListAttributeValue<boolean>;
    onSelectAssociation: (newObject: ObjectItem[] | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    isSearchable: boolean;
    isReadOnly: boolean;
    showSelectAll: boolean;
    maxHeight?: string;
    moreResultsText?: string;
    optionsStyle: OptionsStyleEnum;
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number;
}

const ReferenceSetDropdown = (props: ReferenceSetDropdownProps): JSX.Element => {
    const [showMenu, setShowMenu] = useState(false);
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const searchInput = useRef<HTMLInputElement>(null);
    const srsRef = useRef(null);

    const focusSearchInput = (): void => {
        if (props.currentValues === undefined && searchInput.current !== null) {
            searchInput.current.focus();
        }
    };

    useEffect(() => {
        // Auto focus the input if the popup is open
        if (showMenu) {
            focusSearchInput();
        } else {
            // clear search text if the menu is closed
            props.setMxFilter("");
        }
    }, [showMenu]);

    useOnClickOutside(srsRef, () => {
        // handle click outside
        setShowMenu(false);
        setFocusedObjIndex(-1);
    });

    const onSelectHandler = (selectedObj: ObjectItem | undefined): void => {
        if (selectedObj !== undefined) {
            if (props.currentValues.length > 0) {
                if (props.currentValues.find(obj => obj.id === selectedObj.id)) {
                    if (props.isClearable || props.currentValues.length > 1) {
                        // obj already selected , deselect
                        onRemoveHandler(selectedObj);
                    }
                } else {
                    // list already exists, add to list
                    props.onSelectAssociation([...props.currentValues, selectedObj]);
                }
            } else {
                // list is empty, start list
                props.onSelectAssociation([selectedObj]);
            }
        } else {
            // clear all
            props.onSelectAssociation(selectedObj);
        }
        props.setMxFilter("");
    };

    const onRemoveHandler = (removeObj: ObjectItem): void => {
        props.onSelectAssociation(props.currentValues.filter(obj => obj.id !== removeObj.id));
        props.setMxFilter("");
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
        // function to control navigation of the list via arrow keys etc
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
                    onSelectHandler(props.selectableObjects[focusedObjIndex]);
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
            onSelectHandler(undefined);
        }
        setTimeout(() => focusSearchInput(), 300);
    };

    const handleSelectAll = (event: React.MouseEvent<HTMLSpanElement>): void => {
        event.stopPropagation();
        props.setMxFilter("");
        setFocusedObjIndex(-1);
        props.onSelectAssociation(props.selectableObjects);
    };

    return (
        <div
            className={showMenu ? "form-control active" : "form-control"}
            tabIndex={props.tabIndex || 0}
            onClick={() => {
                setShowMenu(!showMenu);
                if (showMenu === false) {
                    setTimeout(() => focusSearchInput(), 300);
                }
            }}
            onKeyDown={handleInputKeyDown}
            ref={srsRef}
        >
            {props.referenceSetStyle === "badges" && (
                <React.Fragment>
                    {props.maxReferenceDisplay > 0 && (
                        <React.Fragment>
                            {props.currentValues
                                .slice(0, props.maxReferenceDisplay)
                                .map((currentValue: ObjectItem, key) => (
                                    <Badge
                                        key={key}
                                        content={currentValue}
                                        isClearable={props.isClearable || props.currentValues.length > 1}
                                        isReadOnly={props.isReadOnly}
                                        optionTextType={props.optionTextType}
                                        onRemoveAssociation={() => onRemoveHandler(currentValue)}
                                        displayAttribute={props.displayAttribute}
                                    />
                                ))}
                        </React.Fragment>
                    )}
                    {props.maxReferenceDisplay <= 0 && (
                        <React.Fragment>
                            {props.currentValues.map((currentValue: ObjectItem, key) => (
                                <Badge
                                    key={key}
                                    content={currentValue}
                                    isClearable={props.isClearable || props.currentValues.length > 1}
                                    isReadOnly={props.isReadOnly}
                                    optionTextType={props.optionTextType}
                                    onRemoveAssociation={() => onRemoveHandler(currentValue)}
                                    displayAttribute={props.displayAttribute}
                                />
                            ))}
                        </React.Fragment>
                    )}
                    {props.currentValues.length > props.maxReferenceDisplay && props.maxReferenceDisplay > 0 && (
                        <span className="srs-extra">
                            {`(+ ${props.currentValues.length - props.maxReferenceDisplay})`}
                        </span>
                    )}
                </React.Fragment>
            )}
            {props.referenceSetStyle === "commas" && (
                <React.Fragment>
                    {props.maxReferenceDisplay > 0 && (
                        <React.Fragment>
                            {props.currentValues
                                .slice(0, props.maxReferenceDisplay)
                                .map((currentValue: ObjectItem, index) => (
                                    <React.Fragment key={index}>
                                        <Comma
                                            content={currentValue}
                                            isClearable={props.isClearable}
                                            isReadOnly={props.isReadOnly}
                                            optionTextType={props.optionTextType}
                                            onRemoveAssociation={() => onRemoveHandler(currentValue)}
                                            displayAttribute={props.displayAttribute}
                                        />
                                        {index < props.currentValues.length - 1 &&
                                            index !== props.maxReferenceDisplay - 1 && <span>,</span>}
                                    </React.Fragment>
                                ))}
                        </React.Fragment>
                    )}
                    {props.maxReferenceDisplay <= 0 && (
                        <React.Fragment>
                            {props.currentValues.map((currentValue: ObjectItem, index) => (
                                <React.Fragment key={index}>
                                    <Comma
                                        content={currentValue}
                                        isClearable={props.isClearable}
                                        isReadOnly={props.isReadOnly}
                                        optionTextType={props.optionTextType}
                                        onRemoveAssociation={() => onRemoveHandler(currentValue)}
                                        displayAttribute={props.displayAttribute}
                                    />
                                    {index < props.currentValues.length - 1 &&
                                        index !== props.maxReferenceDisplay - 1 && <span>,</span>}
                                </React.Fragment>
                            ))}
                        </React.Fragment>
                    )}

                    {props.currentValues.length > props.maxReferenceDisplay && props.maxReferenceDisplay > 0 && (
                        <span className="srs-extra">
                            {`(+ ${props.currentValues.length - props.maxReferenceDisplay})`}
                        </span>
                    )}
                </React.Fragment>
            )}

            {props.isSearchable && (
                <input
                    name={props.name}
                    placeholder={props.currentValues.length === 0 ? props.placeholder : ""}
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

            {props.isSearchable === false && (
                <span className="srs-text">{props.currentValues.length === 0 ? props.placeholder : ""}</span>
            )}

            {props.showSelectAll && props.isReadOnly === false && (
                <SelectAllIcon onClick={handleSelectAll} title={"Select All"} />
            )}

            {props.isClearable && props.isReadOnly === false && <CancelIcon onClick={handleClear} title={"Clear"} />}
            <DropdownIcon />
            {showMenu && (
                <OptionsMenu
                    selectableObjects={props.selectableObjects}
                    displayAttribute={props.displayAttribute}
                    onSelectOption={(newObject: ObjectItem | undefined) => onSelectHandler(newObject)}
                    currentValue={props.currentValues}
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
                />
            )}
        </div>
    );
};

export default ReferenceSetDropdown;
