import { createElement, useState, useRef, ReactElement, Fragment, ChangeEvent } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, WebIcon, ListActionValue, ListExpressionValue } from "mendix";
import OptionsMenu from "../reference/OptionsMenu";
import {
    OptionsStyleSetEnum,
    OptionTextTypeEnum,
    ReferenceSetStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import useOnClickOutside from "../../custom hooks/useOnClickOutside";
import usePositionUpdate, { mapPosition, Position } from "../../custom hooks/usePositionUpdate";
import focusSearchInput from "../../utils/focusSearchInput";
import handleKeyNavigation from "src/utils/reference/handleKeyNavigation";
import handleClear from "src/utils/handleClear";
import handleSelectAll from "src/utils/reference/handleSelectAll";
import handleRemoveObj from "src/utils/reference/handleSelectSet";
import SearchInput from "../reference/SearchInput";
import CurrentValueSet from "../reference/CurrentValueSet";
import MxIcon from "../MxIcon";
// import LoadingIndicator from "../LoadingIndicator";

interface ReferenceSetDropdownProps {
    name: string;
    tabIndex: number | undefined;
    placeholder: string | undefined;
    noResultsText: string;
    selectableObjects: ObjectItem[] | undefined;
    currentValues: ObjectItem[] | undefined;
    displayAttribute: ListAttributeValue<string>;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent: ListWidgetValue | undefined;
    selectableCondition: ListExpressionValue<boolean> | undefined;
    onSelectAssociation: (newObject: ObjectItem[] | undefined) => void;
    onSelectMoreOptions: (() => void) | undefined;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    isClearable: boolean;
    clearIcon: WebIcon | undefined;
    isSearchable: boolean;
    isReadOnly: boolean;
    showSelectAll: boolean;
    selectAllIcon: WebIcon | undefined;
    dropdownIcon: WebIcon | undefined;
    maxHeight: string;
    moreResultsText: string | undefined;
    optionsStyle: OptionsStyleSetEnum;
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number;
    onBadgeClick: ListActionValue | undefined;
    // isLoading: boolean;
}

const ReferenceSetDropdown = ({
    // isLoading,
    currentValues,
    isClearable,
    isReadOnly,
    isSearchable,
    maxReferenceDisplay,
    mxFilter,
    name,
    onSelectAssociation,
    optionTextType,
    optionsStyle,
    referenceSetStyle,
    selectableObjects,
    setMxFilter,
    showSelectAll,
    clearIcon,
    displayAttribute,
    dropdownIcon,
    maxHeight,
    moreResultsText,
    noResultsText,
    onBadgeClick,
    optionCustomContent,
    placeholder,
    selectAllIcon,
    selectableCondition,
    tabIndex,
    onSelectMoreOptions
}: ReferenceSetDropdownProps): ReactElement => {
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
        setMxFilter("");
    });

    const onSelectHandler = (selectedObj: ObjectItem | undefined): void => {
        if (selectedObj !== undefined) {
            if (currentValues !== undefined && currentValues.length > 0) {
                if (currentValues.find(obj => obj.id === selectedObj.id)) {
                    if (isClearable || currentValues.length > 1) {
                        // obj already selected , deselect
                        handleRemoveObj(selectedObj, setMxFilter, onSelectAssociation, currentValues);
                    }
                } else {
                    // list already exists, add to list
                    onSelectAssociation([...currentValues, selectedObj]);
                }
            } else {
                // list is empty, start list
                onSelectAssociation([selectedObj]);
            }
        } else {
            // clear all
            onSelectAssociation(selectedObj);
        }
        setMxFilter("");
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
                    if (showMenu === false) {
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
                    selectableCondition,
                    false,
                    isReadOnly,
                    () => setPosition(mapPosition(srsRef.current)),
                    setShowMenu
                )
            }
            ref={srsRef}
        >
            {isReadOnly && (currentValues === undefined || currentValues.length === 0) ? (
                <input
                    name={name}
                    placeholder={placeholder}
                    type="text"
                    readOnly={isReadOnly}
                    disabled={isReadOnly}
                    value={mxFilter}
                    autoComplete="off"
                ></input>
            ) : (
                <CurrentValueSet
                    currentValues={currentValues}
                    displayAttribute={displayAttribute}
                    isClearable={isClearable}
                    isReadOnly={isReadOnly}
                    maxReferenceDisplay={maxReferenceDisplay}
                    onRemove={clickObj =>
                        handleRemoveObj(clickObj, setMxFilter, onSelectAssociation, currentValues || [])
                    }
                    optionTextType={optionTextType}
                    referenceSetStyle={referenceSetStyle}
                    clearIcon={clearIcon}
                    onBadgeClick={onBadgeClick}
                    optionCustomContent={optionCustomContent}
                />
            )}

            {!isReadOnly && (
                <Fragment>
                    <SearchInput
                        currentValue={undefined}
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
                    />

                    <div className="srs-icon-row">
                        {/* {isLoading && <LoadingIndicator />} */}

                        {showSelectAll && (
                            <MxIcon
                                onClick={event =>
                                    handleSelectAll(
                                        event,
                                        setMxFilter,
                                        setFocusedObjIndex,
                                        onSelectAssociation,
                                        selectableObjects || [],
                                        selectableCondition
                                    )
                                }
                                title={"Select All"}
                                mxIconOverride={selectAllIcon}
                                defaultClassName="check"
                            />
                        )}

                        {isClearable && (
                            <MxIcon
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
                                defaultClassName="remove"
                            />
                        )}
                        <MxIcon mxIconOverride={dropdownIcon} defaultClassName="menu-down" />
                    </div>

                    {showMenu && (
                        <OptionsMenu
                            selectableObjects={selectableObjects}
                            displayAttribute={displayAttribute}
                            onSelectOption={(newObject: ObjectItem | undefined) => onSelectHandler(newObject)}
                            currentValue={currentValues}
                            currentFocus={
                                selectableObjects !== undefined ? selectableObjects[focusedObjIndex] : undefined
                            }
                            maxHeight={maxHeight}
                            selectableCondition={selectableCondition}
                            noResultsText={noResultsText}
                            optionTextType={optionTextType}
                            optionCustomContent={optionCustomContent}
                            moreResultsText={moreResultsText}
                            optionsStyle={optionsStyle}
                            selectStyle={"dropdown"}
                            position={position}
                            isReadyOnly={isReadOnly}
                            onSelectMoreOptions={()=>{
                                if (onSelectMoreOptions){
                                    onSelectMoreOptions();
                                    focusSearchInput(searchInput, 300);
                                }
                            }}
                        />
                    )}
                </Fragment>
            )}
        </div>
    );
};

export default ReferenceSetDropdown;
