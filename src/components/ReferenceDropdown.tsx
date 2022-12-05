import { createElement, useState, useRef, ReactElement, ChangeEvent } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon } from "mendix";
import ClearIcon from "./icons/ClearIcon";
import DropdownIcon from "./icons/DropdownIcon";
import OptionsMenu from "./OptionsMenu";
import { OptionsStyleEnum, OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import useOnClickOutside from "../custom hooks/useOnClickOutside";
import usePositionUpdate, { mapPosition, Position } from "../custom hooks/usePositionUpdate";
import focusSearchInput from "../utils/focusSearchInput";
import handleKeyNavigation from "../utils/handleKeyNavigation";
import handleClear from "src/utils/handleClear";
import SearchInput from "./SearchInput";

interface ReferenceDropdownProps {
    name: string;
    tabIndex?: number;
    placeholder?: string;
    noResultsText?: string;
    selectableObjects: ObjectItem[] | undefined;
    currentValue?: ObjectItem | undefined;
    displayAttribute: ListAttributeValue<string>;
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
    // isLoading: boolean;
}

const ReferenceDropdown = ({
    // isLoading,
    isClearable,
    isReadOnly,
    isSearchable,
    mxFilter,
    name,
    onSelectAssociation,
    optionTextType,
    optionsStyle,
    selectableObjects,
    setMxFilter,
    clearIcon,
    currentValue,
    displayAttribute,
    dropdownIcon,
    maxHeight,
    moreResultsText,
    noResultsText,
    optionCustomContent,
    placeholder,
    selectableAttribute,
    tabIndex
}: ReferenceDropdownProps): ReactElement => {
    const [showMenu, setShowMenu] = useState(false);
    const [focusedObjIndex, setFocusedObjIndex] = useState<number>(-1);
    const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);
    const srsRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0, w: 0, h: 0 });

    usePositionUpdate(srsRef, newPosition => {
        setPosition(newPosition);
    });

    useOnClickOutside(srsRef, () => {
        // handle click outside
        setShowMenu(false);
        setFocusedObjIndex(-1);
    });

    const onSelectHandler = (selectedObj: ObjectItem | undefined, closeMenu: boolean): void => {
        if (currentValue?.id === selectedObj?.id && isClearable) {
            onSelectAssociation(undefined);
        } else {
            onSelectAssociation(selectedObj);
        }
        setMxFilter("");
        if (closeMenu) {
            setShowMenu(false);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setMxFilter(value);
        setFocusedObjIndex(0);
        // make sure the dropdown is open if the user is typing
        if (value.trim() !== "" && showMenu === false) {
            setShowMenu(true);
        }
    };

    return (
        <div
            className={`form-control ${showMenu ? "active" : ""} ${isReadOnly ? "read-only" : ""}`}
            tabIndex={!isReadOnly ? tabIndex || 0 : undefined}
            onClick={() => {
                if (!isReadOnly) {
                    setShowMenu(!showMenu);
                    setPosition(mapPosition(srsRef.current));
                    if (showMenu === false && searchInput) {
                        focusSearchInput(searchInput, 300);
                    }
                }
            }}
            onKeyDown={event =>
                handleKeyNavigation(
                    event,
                    focusedObjIndex,
                    setFocusedObjIndex,
                    selectableObjects || [],
                    onSelectHandler,
                    selectableAttribute,
                    true,
                    () => setPosition(mapPosition(srsRef.current)),
                    setShowMenu
                )
            }
            ref={srsRef}
        >
            <SearchInput
                currentValue={currentValue}
                displayAttribute={displayAttribute}
                isReadOnly={isReadOnly}
                isSearchable={isSearchable}
                mxFilter={mxFilter}
                name={name}
                onChange={handleInputChange}
                optionCustomContent={optionCustomContent}
                optionTextType={optionTextType}
                placeholder={placeholder}
                setRef={newRef => setSearchInput(newRef)}
                showMenu={showMenu}
            />
            {!isReadOnly && (
                <div className="srs-icon-row">
                    {isClearable && (
                        <ClearIcon
                            onClick={event => {
                                setPosition(mapPosition(srsRef.current));
                                handleClear(
                                    event,
                                    mxFilter,
                                    setMxFilter,
                                    setFocusedObjIndex,
                                    onSelectHandler,
                                    searchInput,
                                    setShowMenu
                                );
                            }}
                            title={"Clear"}
                            mxIconOverride={clearIcon}
                        />
                    )}

                    <DropdownIcon mxIconOverride={dropdownIcon} />
                </div>
            )}
            {showMenu && (
                <OptionsMenu
                    selectableObjects={selectableObjects}
                    displayAttribute={displayAttribute}
                    onSelectOption={(newObject: ObjectItem | undefined) => {
                        const newObjSelectable =
                            newObject !== undefined && selectableAttribute !== undefined
                                ? selectableAttribute.get(newObject).value === true
                                : true;
                        onSelectHandler(newObject, newObjSelectable);
                    }}
                    currentValue={currentValue}
                    currentFocus={selectableObjects !== undefined ? selectableObjects[focusedObjIndex] : undefined}
                    maxHeight={maxHeight}
                    selectableAttribute={selectableAttribute}
                    noResultsText={noResultsText}
                    optionTextType={optionTextType}
                    optionCustomContent={optionCustomContent}
                    moreResultsText={moreResultsText}
                    optionsStyle={optionsStyle}
                    selectStyle={"dropdown"}
                    position={position}
                    isReadyOnly={isReadOnly}
                    // isLoading={isLoading}
                />
            )}
        </div>
    );
};

export default ReferenceDropdown;
