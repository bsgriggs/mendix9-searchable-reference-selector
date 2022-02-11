import { ReactElement, createElement, useState, CSSProperties, useEffect, useRef } from "react";
import { ListValue, ListActionValue, ListAttributeValue, ObjectItem, ActionValue } from "mendix";
import classNames from "classnames";

export interface SearchableReferenceSelectorProps {
    name: string;
    tabIndex: number;
    className: string;
    style?: CSSProperties;
    selectableObjects: ListValue;
    displayAttribute: ListAttributeValue<string>;
    currentValue: string;
    onSelectAssociation?: ListActionValue;
    noneSelectedText: string;
    onSelectEmpty?: ActionValue;
}

export default function SearchableReferenceSelector({
    tabIndex,
    className,
    style,
    selectableObjects,
    displayAttribute,
    currentValue,
    onSelectAssociation,
    onSelectEmpty,
    noneSelectedText
}: SearchableReferenceSelectorProps): ReactElement {
    const [showPopup, setShowPopup] = useState(false);
    const [searchText, setSearchText] = useState("");
    const ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (showPopup) {
            const handleClickOutside = (event: any) => {
                if (ref.current && !ref.current.contains(event.target)) {
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
        if (selectedObj !== undefined && onSelectAssociation !== undefined) {
            const mxaction = onSelectAssociation.get(selectedObj);
            mxaction.execute();
            toggleDropdown();
        } else if (onSelectEmpty !== undefined) {
            onSelectEmpty.execute();
            toggleDropdown();
        } else {
            toggleDropdown();
        }
    }

    return (
        <div ref={ref} className={classNames("widget-reference-selector", className)} style={style}>
            <button tabIndex={tabIndex} className="form-control" onClick={toggleDropdown}>
                {currentValue}
            </button>
            {showPopup && (
                <div className="dropdown">
                    <div className="searchBar">
                        <input
                            type="text"
                            placeholder="Search"
                            className="form-control"
                            onChange={event => {
                                setSearchText(event.target.value);
                            }}
                            value={searchText}
                        />
                        <button
                            className="btn mx-button btn-danger"
                            onClick={() => {
                                setSearchText("");
                            }}
                        >
                            Reset
                        </button>
                    </div>
                    {selectableObjects.items !== undefined && (
                        <ul>
                            <li
                                onClick={() => {
                                    onSelectHandler(undefined);
                                }}
                            >
                                {noneSelectedText ? noneSelectedText : <div>&nbsp;</div>}
                            </li>
                            {searchText.trim().length > 0 &&
                                selectableObjects.items
                                    .filter(obj => {
                                        const text = displayAttribute.get(obj).value;
                                        return (
                                            text !== undefined && text.toLowerCase().includes(searchText.toLowerCase())
                                        );
                                    })
                                    .map((obj, key) => {
                                        const text = displayAttribute.get(obj).value;
                                        if (text !== undefined) {
                                            return (
                                                <li
                                                    className={text === currentValue ? ".selected" : ""}
                                                    key={key}
                                                    onClick={() => {
                                                        onSelectHandler(obj);
                                                    }}
                                                >
                                                    {text}
                                                </li>
                                            );
                                        } else {
                                            return <li>&nbsp;</li>;
                                        }
                                    })}
                            {searchText.trim().length === 0 &&
                                selectableObjects.items.map((obj, key) => {
                                    const text = displayAttribute.get(obj).value;
                                    if (text !== undefined) {
                                        return (
                                            <li
                                                className={text === currentValue ? "selected" : ""}
                                                key={key}
                                                onClick={() => {
                                                    onSelectHandler(obj);
                                                }}
                                            >
                                                {text}
                                            </li>
                                        );
                                    } else {
                                        return <li>&nbsp;</li>;
                                    }
                                })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
