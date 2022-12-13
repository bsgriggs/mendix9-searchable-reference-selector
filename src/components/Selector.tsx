import { createElement, Fragment, ReactElement } from "react";
import { EnumOption } from "typings/general";
import {
    SelectionTypeEnum,
    SelectStyleEnum,
    OptionTextTypeEnum,
    OptionsStyleSingleEnum,
    OptionsStyleSetEnum,
    ReferenceSetStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import { Alert } from "./Alert";
import EnumDropdown from "./enum/EnumDropdown";
import EnumList from "./enum/EnumList";
import ReferenceDropdown from "./reference/ReferenceDropdown";
import ReferenceList from "./reference/ReferenceList";
import ReferenceSetDropdown from "./reference/ReferenceSetDropdown";
import ReferenceSetList from "./reference/ReferenceSetList";
import {
    ObjectItem,
    ActionValue,
    EditableValue,
    ReferenceValue,
    ReferenceSetValue,
    WebIcon,
    ListAttributeValue,
    ListWidgetValue,
    ListActionValue,
    ListExpressionValue
} from "mendix";

interface SelectorProps {
    selectionType: SelectionTypeEnum;
    selectStyle: SelectStyleEnum;
    name: string;
    tabIndex: number | undefined;
    association: ReferenceValue | ReferenceSetValue;
    isClearable: boolean;
    clearIcon: WebIcon | undefined;
    dropdownIcon: WebIcon | undefined;
    selectAllIcon: WebIcon | undefined;
    onChange: ActionValue | undefined;
    onBadgeClick: ListActionValue | undefined;
    refOptions: ObjectItem[] | undefined;
    placeholder: string;
    isSearchable: boolean;
    maxMenuHeight: string;
    noResultsText: string;
    displayAttribute: ListAttributeValue<string>;
    selectableAttribute: ListExpressionValue<boolean> | undefined;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent: ListWidgetValue | undefined;
    mxFilter: string;
    setMxFilter: (newFilter: string) => void;
    moreResultsText: string | undefined;
    optionsStyleSingle: OptionsStyleSingleEnum;
    optionsStyleSet: OptionsStyleSetEnum;
    referenceSetStyle: ReferenceSetStyleEnum;
    maxReferenceDisplay: number;
    showSelectAll: boolean;
    enumAttribute: EditableValue<string>;
    enumUniverse: EnumOption[];
    enumOptions: EnumOption[];
    onSelectReference: (
        selectedObj: (ObjectItem & ObjectItem[]) | undefined,
        association: ReferenceValue | ReferenceSetValue,
        onChange: ActionValue | undefined
    ) => void;
    onSelectEnum: (
        currentValue: string | undefined,
        selectedEnum: string | undefined,
        enumAttribute: EditableValue<string>,
        onChange: ActionValue | undefined
    ) => void;
}

export default function Selector({
    association,
    clearIcon,
    displayAttribute,
    dropdownIcon,
    enumAttribute,
    enumOptions,
    enumUniverse,
    isClearable,
    isSearchable,
    maxMenuHeight,
    maxReferenceDisplay,
    moreResultsText,
    mxFilter,
    name,
    noResultsText,
    onBadgeClick,
    onChange,
    optionCustomContent,
    optionTextType,
    optionsStyleSet,
    optionsStyleSingle,
    placeholder,
    refOptions,
    referenceSetStyle,
    selectAllIcon,
    selectStyle,
    selectableAttribute,
    selectionType,
    setMxFilter,
    showSelectAll,
    tabIndex,
    onSelectEnum,
    onSelectReference
}: SelectorProps): ReactElement {
    // Determine which selector to render based on the user's props
    switch (selectionType) {
        case "reference":
            if (selectStyle === "dropdown") {
                return (
                    <Fragment>
                        <ReferenceDropdown
                            name={name}
                            tabIndex={tabIndex}
                            currentValue={association.value as ObjectItem}
                            isClearable={isClearable}
                            clearIcon={clearIcon}
                            dropdownIcon={dropdownIcon}
                            onSelectAssociation={(newAssociation: ObjectItem | undefined) =>
                                onSelectReference(newAssociation as ObjectItem & ObjectItem[], association, onChange)
                            }
                            selectableObjects={refOptions}
                            placeholder={placeholder}
                            isReadOnly={association.readOnly}
                            isSearchable={isSearchable}
                            maxHeight={maxMenuHeight}
                            noResultsText={noResultsText}
                            displayAttribute={displayAttribute}
                            optionTextType={optionTextType}
                            selectableAttribute={selectableAttribute}
                            optionCustomContent={optionCustomContent}
                            mxFilter={mxFilter}
                            setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                            moreResultsText={moreResultsText}
                            optionsStyle={optionsStyleSingle}
                            // isLoading={isLoading}
                        />
                        {association.validation && <Alert>{association.validation}</Alert>}
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        <ReferenceList
                            name={name}
                            tabIndex={tabIndex}
                            currentValue={association.value as ObjectItem}
                            isClearable={isClearable}
                            clearIcon={clearIcon}
                            onSelectAssociation={(newAssociation: ObjectItem | undefined) =>
                                onSelectReference(newAssociation as ObjectItem & ObjectItem[], association, onChange)
                            }
                            selectableObjects={refOptions}
                            placeholder={placeholder}
                            isReadOnly={association.readOnly}
                            noResultsText={noResultsText}
                            displayAttribute={displayAttribute}
                            optionTextType={optionTextType}
                            selectableAttribute={selectableAttribute}
                            optionCustomContent={optionCustomContent}
                            mxFilter={mxFilter}
                            setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                            moreResultsText={moreResultsText}
                            optionsStyle={optionsStyleSingle}
                            isSearchable={isSearchable}
                            // isLoading={isLoading}
                        />
                        {association.validation && <Alert>{association.validation}</Alert>}
                    </Fragment>
                );
            }

        case "referenceSet":
            if (selectStyle === "dropdown") {
                return (
                    <Fragment>
                        <ReferenceSetDropdown
                            name={name}
                            tabIndex={tabIndex}
                            currentValues={association.value as ObjectItem[]}
                            isClearable={isClearable}
                            clearIcon={clearIcon}
                            dropdownIcon={dropdownIcon}
                            onSelectAssociation={(newAssociation: ObjectItem[] | undefined) =>
                                onSelectReference(newAssociation as ObjectItem & ObjectItem[], association, onChange)
                            }
                            selectableObjects={refOptions}
                            placeholder={placeholder}
                            isReadOnly={association.readOnly}
                            isSearchable={isSearchable}
                            maxHeight={maxMenuHeight}
                            noResultsText={noResultsText}
                            displayAttribute={displayAttribute}
                            optionTextType={optionTextType}
                            selectableAttribute={selectableAttribute}
                            optionCustomContent={optionCustomContent}
                            mxFilter={mxFilter}
                            setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                            moreResultsText={moreResultsText}
                            optionsStyle={optionsStyleSet}
                            referenceSetStyle={referenceSetStyle}
                            maxReferenceDisplay={maxReferenceDisplay}
                            showSelectAll={showSelectAll}
                            selectAllIcon={selectAllIcon}
                            onBadgeClick={onBadgeClick}
                            // isLoading={isLoading}
                        />
                        {association.validation && <Alert>{association.validation}</Alert>}
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        <ReferenceSetList
                            name={name}
                            tabIndex={tabIndex}
                            currentValues={association.value as ObjectItem[]}
                            isClearable={isClearable}
                            clearIcon={clearIcon}
                            onSelectAssociation={(newAssociation: ObjectItem[] | undefined) =>
                                onSelectReference(newAssociation as ObjectItem & ObjectItem[], association, onChange)
                            }
                            selectableObjects={refOptions}
                            placeholder={placeholder}
                            isReadOnly={association.readOnly}
                            noResultsText={noResultsText}
                            displayAttribute={displayAttribute}
                            optionTextType={optionTextType}
                            selectableAttribute={selectableAttribute}
                            optionCustomContent={optionCustomContent}
                            mxFilter={mxFilter}
                            setMxFilter={(newFilter: string) => setMxFilter(newFilter)}
                            moreResultsText={moreResultsText}
                            optionsStyle={optionsStyleSet}
                            isSearchable={isSearchable}
                            showSelectAll={showSelectAll}
                            selectAllIcon={selectAllIcon}
                            maxReferenceDisplay={maxReferenceDisplay}
                            referenceSetStyle={referenceSetStyle}
                            // isLoading={isLoading}
                        />
                        {association.validation && <Alert>{association.validation}</Alert>}
                    </Fragment>
                );
            }

        case "enumeration":
            const currentValue = enumUniverse.find(enu => enu.name === enumAttribute.value);
            if (selectStyle === "dropdown") {
                return (
                    <Fragment>
                        <EnumDropdown
                            name={name}
                            tabIndex={tabIndex}
                            placeholder={placeholder}
                            noResultsText={noResultsText as string}
                            options={enumOptions}
                            currentValue={currentValue}
                            onSelectEnum={(enumValue: string | undefined) =>
                                onSelectEnum(enumAttribute.value, enumValue, enumAttribute, onChange)
                            }
                            mxFilter={mxFilter}
                            setMxFilter={setMxFilter}
                            isClearable={isClearable}
                            isSearchable={isSearchable}
                            clearIcon={clearIcon}
                            dropdownIcon={dropdownIcon}
                            isReadOnly={enumAttribute.readOnly}
                            maxHeight={maxMenuHeight}
                            optionsStyle={optionsStyleSingle}
                        />
                        {enumAttribute.validation && <Alert>{enumAttribute.validation}</Alert>}
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        <EnumList
                            name={name}
                            tabIndex={tabIndex}
                            placeholder={placeholder}
                            noResultsText={noResultsText}
                            options={enumOptions}
                            currentValue={currentValue}
                            onSelectEnum={(enumValue: string | undefined) =>
                                onSelectEnum(enumAttribute.value, enumValue, enumAttribute, onChange)
                            }
                            mxFilter={mxFilter}
                            setMxFilter={setMxFilter}
                            isClearable={isClearable}
                            isSearchable={isSearchable}
                            clearIcon={clearIcon}
                            isReadOnly={enumAttribute.readOnly}
                            optionsStyle={optionsStyleSingle}
                        />
                        {enumAttribute.validation && <Alert>{enumAttribute.validation}</Alert>}
                    </Fragment>
                );
            }
    }
}
