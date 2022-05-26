import React, { createElement, useState, useEffect, useRef} from "react";
import { SearchableReferenceSelectorContainerProps } from "../typings/SearchableReferenceSelectorProps";
import { ObjectItem, ValueStatus } from "mendix";
import "./ui/SearchableReferenceSelector.css";
import Option from "./components/option";

const emptyString = "&nbsp;";

const SearchableReferenceSelector = (props: SearchableReferenceSelectorContainerProps): JSX.Element => {
    if (props.association.status !== ValueStatus.Loading && props.selectableObjects.status !== ValueStatus.Loading) {
        // Consts
        const associationValue =
            props.association.value !== undefined
                ? props.displayAttribute.get(props.association.value).value
                : undefined;
        const currentStringValue =
            associationValue === undefined
                ? props.noneSelectedText?.value !== undefined
                    ? props.noneSelectedText.value
                    : emptyString
                : associationValue.toString();
        // Hooks
        const [showPopup, setShowPopup] = useState(false);
        const [searchText, setSearchText] = useState<string>(
            associationValue !== undefined ? associationValue.toString() : ""
        );
        const componentRef = useRef<HTMLHeadingElement>(null);
        const searchRef = useRef<HTMLInputElement>(null);

        useEffect(() => {
            if (showPopup) {
                const handleClickOutside = (event: any) => {
                    if (componentRef.current && !componentRef.current.contains(event.target)) {
                        toggleDropdown();
                    }
                };
                document.addEventListener("click", handleClickOutside, true);
                return () => {
                    document.removeEventListener("click", handleClickOutside, true);
                };
            }
        }, [!showPopup]);

        function toggleDropdown(): void {
            // show the dropdown popup and trigger the search
            setShowPopup(!showPopup);
        }

        function onSelectHandler(selectedObj?: ObjectItem): void {
            // update Mendix object
            props.association.setValue(selectedObj);
            toggleDropdown();
            // update search bar
            if (selectedObj !== undefined) {
                const selectedString = props.displayAttribute.get(selectedObj).value;
                if (selectedString !== undefined) {
                    setSearchText(selectedString);
                }
            }
        }
        const renderOption = (obj: ObjectItem, key: React.Key): JSX.Element => {
            const text = props.displayAttribute.get(obj).value;
            return (
                <Option
                    key={key}
                    text={text}
                    isSelected={text === currentStringValue}
                    onSelect={() => onSelectHandler(obj)}
                />
            );
        };

        const renderOptions = (): JSX.Element[] => {
            if (props.selectableObjects.items !== undefined){
            if (searchText.trim().length > 0 && searchText !== currentStringValue){
                return (props.selectableObjects.items
                .filter(obj => {
                    const text = props.displayAttribute.get(obj).value?.toString();
                    return (
                        text !== undefined &&
                        text.toLowerCase().includes(searchText.toLowerCase())
                    );
                })
                .map(renderOption));
            } else {
                return props.selectableObjects.items.map(renderOption);
            }
            } else {
                return [<React.Fragment/>];
            }
        }

        return (
            <div id={props.id} ref={componentRef} className={"widget-reference-selector"}>
                <div className="searchBar">
                    <input
                        ref={searchRef}
                        tabIndex={props.tabIndex}
                        type="text"
                        placeholder="Search"
                        className="form-control"
                        onChange={event => {
                            setSearchText(event.target.value);
                            if (!showPopup) {
                                setShowPopup(true);
                            }
                        }}
                        onClick={toggleDropdown}
                        value={searchText}
                    />
                    <button
                        className="btn mx-button btn-danger"
                        onClick={() => {
                            setSearchText("");
                            searchRef.current?.focus();
                        }}
                    >
                        Reset
                    </button>
                </div>
                {showPopup && (
                    <div className="dropdown">
                        {props.selectableObjects.items !== undefined && (
                            <React.Fragment>
                                {props.allowEmptySelection && (
                                    // Empty selection option
                                    <Option
                                        key={-1}
                                        isSelected={associationValue === undefined}
                                        onSelect={() => onSelectHandler(undefined)}
                                        text={
                                            props.noneSelectedText
                                                ? props.noneSelectedText.value?.toString()
                                                : undefined
                                        }
                                    />
                                )}
                                {renderOptions()}
                            </React.Fragment>
                        )}
                    </div>
                )}
            </div>
        );
    } else {
        return <React.Fragment />;
    }
};

export default SearchableReferenceSelector;
