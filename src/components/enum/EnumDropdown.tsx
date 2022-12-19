import { createElement, useState, useRef, ReactElement, Fragment, ChangeEvent } from "react";
import { WebIcon } from "mendix";
import OptionsMenu from "./OptionsMenu";
import { OptionsStyleSingleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import useOnClickOutside from "../../custom hooks/useOnClickOutside";
import usePositionUpdate, { mapPosition, Position } from "../../custom hooks/usePositionUpdate";
import { EnumOption } from "typings/general";
import focusSearchInput from "../../utils/focusSearchInput";
import handleKeyNavigation from "../../utils/enum/handleKeyNavigation";
import handleClear from "../../utils/handleClear";
import MxIcon from "../MxIcon";
import SearchInput from "./SearchInput";
// import LoadingIndicator from "../LoadingIndicator";

interface EnumDropdownProps {
    name: string;
    tabIndex: number | undefined;
    placeholder: string | undefined;
    noResultsText: string;
    options: EnumOption[];
    currentValue: EnumOption | undefined;
    onSelectEnum: (enumValue: string | undefined) => void;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    isSearchable: boolean;
    clearIcon: WebIcon | undefined;
    dropdownIcon: WebIcon | undefined;
    isReadOnly: boolean;
    maxHeight: string;
    optionsStyle: OptionsStyleSingleEnum;
    // isLoading:Boolean;
}

const EnumDropdown = ({
    isClearable,
    isReadOnly,
    isSearchable,
    mxFilter,
    name,
    onSelectEnum,
    options,
    optionsStyle,
    setMxFilter,
    clearIcon,
    currentValue,
    dropdownIcon,
    maxHeight,
    noResultsText,
    placeholder,
    tabIndex
}: // isLoading
EnumDropdownProps): ReactElement => {
    const [showMenu, setShowMenu] = useState(false);
    const [focusedEnumIndex, setFocusedEnumIndex] = useState<number>(-1);
    const [searchInput, setSearchInput] = useState<HTMLInputElement | null>(null);
    const sesRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<Position>({ x: 0, y: 0, w: 0, h: 0 });

    usePositionUpdate(sesRef, newPosition => {
        setPosition(newPosition);
    });

    useOnClickOutside(sesRef, () => {
        // handle click outside
        setShowMenu(false);
        setFocusedEnumIndex(-1);
    });

    const onSelectHandler = (selectedEnum: string | undefined, closeMenu: boolean): void => {
        if (currentValue === selectedEnum && isClearable) {
            onSelectEnum(undefined);
        } else {
            onSelectEnum(selectedEnum);
        }
        setMxFilter("");
        if (closeMenu) {
            setShowMenu(false);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setMxFilter(value);
        setFocusedEnumIndex(0);
        // make sure the dropdown is open if the user is typing
        if (value.trim() !== "" && showMenu === false) {
            setShowMenu(true);
        }
    };

    return (
        <div
            className={showMenu ? "form-control active" : "form-control"}
            tabIndex={tabIndex || 0}
            onClick={() => {
                if (!isReadOnly) {
                    setShowMenu(!showMenu);
                    setPosition(mapPosition(sesRef.current));
                    if (showMenu === false) {
                        focusSearchInput(searchInput, 300);
                    }
                }
            }}
            onKeyDown={event =>
                handleKeyNavigation(
                    event,
                    focusedEnumIndex,
                    setFocusedEnumIndex,
                    options,
                    onSelectHandler,
                    isReadOnly,
                    setShowMenu
                )
            }
            ref={sesRef}
        >
            <SearchInput
                currentValue={currentValue}
                isReadOnly={isReadOnly}
                isSearchable={isSearchable}
                mxFilter={mxFilter}
                name={name}
                onChange={handleInputChange}
                placeholder={placeholder}
                setRef={newRef => setSearchInput(newRef)}
                showMenu={showMenu}
            />
            {!isReadOnly && (
                <Fragment>
                    <div className="srs-icon-row">
                        {/* {isLoading && <LoadingIndicator />} */}
                        {isClearable && (
                            <MxIcon
                                onClick={event =>
                                    handleClear(
                                        event,
                                        mxFilter,
                                        setMxFilter,
                                        setFocusedEnumIndex,
                                        onSelectHandler,
                                        searchInput,
                                        setShowMenu
                                    )
                                }
                                title={"Clear"}
                                mxIconOverride={clearIcon}
                                defaultClassName="remove"
                            />
                        )}
                        <MxIcon defaultClassName="menu-down" mxIconOverride={dropdownIcon} />
                    </div>

                    {showMenu && (
                        <OptionsMenu
                            options={options}
                            onSelectOption={(newEnumValue: string | undefined) => {
                                onSelectHandler(newEnumValue, true);
                            }}
                            currentValue={currentValue}
                            currentFocus={options[focusedEnumIndex]}
                            maxHeight={maxHeight}
                            noResultsText={noResultsText}
                            optionsStyle={optionsStyle}
                            selectStyle={"dropdown"}
                            position={position}
                            isReadyOnly={isReadOnly}
                        />
                    )}
                </Fragment>
            )}
        </div>
    );
};

export default EnumDropdown;
