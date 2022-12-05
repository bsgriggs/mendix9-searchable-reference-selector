import { createElement, Fragment, ReactElement } from "react";
import { OptionTextTypeEnum, ReferenceSetStyleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import { ObjectItem, ListAttributeValue, ListActionValue, DynamicValue, WebIcon, ListWidgetValue } from "mendix";
import Badge from "./Badge";
import Comma from "./Comma";

interface CurrentValueSetProps {
    referenceSetStyle: ReferenceSetStyleEnum;
    currentValues: ObjectItem[] | undefined;
    maxReferenceDisplay: number;
    isReadOnly: boolean;
    isClearable: boolean;
    optionTextType: OptionTextTypeEnum;
    onRemove: (clickObj: ObjectItem) => void;
    displayAttribute: ListAttributeValue<string>;
    clearIcon?: DynamicValue<WebIcon>;
    onBadgeClick?: ListActionValue;
    optionCustomContent: ListWidgetValue | undefined;
}

export default function CurrentValueSet({
    referenceSetStyle,
    maxReferenceDisplay,
    currentValues,
    isReadOnly,
    isClearable,
    optionTextType,
    onRemove,
    displayAttribute,
    clearIcon,
    onBadgeClick,
    optionCustomContent
}: CurrentValueSetProps): ReactElement {
    return (
        <Fragment>
            {referenceSetStyle === "badges" && currentValues !== undefined && currentValues.length > 0 && (
                <div className="srs-badge-row">
                    {maxReferenceDisplay > 0 && (
                        <Fragment>
                            {currentValues.slice(0, maxReferenceDisplay).map((currentValue: ObjectItem, key) => (
                                <Badge
                                    key={key}
                                    content={currentValue}
                                    isClearable={isClearable || currentValues.length > 1}
                                    isReadOnly={isReadOnly}
                                    optionTextType={optionTextType}
                                    onRemoveAssociation={() => onRemove(currentValue)}
                                    displayAttribute={displayAttribute}
                                    clearIcon={clearIcon}
                                    onBadgeClick={onBadgeClick}
                                    optionCustomContent={optionCustomContent}
                                />
                            ))}
                        </Fragment>
                    )}
                    {maxReferenceDisplay <= 0 && (
                        <Fragment>
                            {currentValues.map((currentValue: ObjectItem, key) => (
                                <Badge
                                    key={key}
                                    content={currentValue}
                                    isClearable={isClearable || currentValues.length > 1}
                                    isReadOnly={isReadOnly}
                                    optionTextType={optionTextType}
                                    onRemoveAssociation={() => onRemove(currentValue)}
                                    displayAttribute={displayAttribute}
                                    clearIcon={clearIcon}
                                    onBadgeClick={onBadgeClick}
                                    optionCustomContent={optionCustomContent}
                                />
                            ))}
                        </Fragment>
                    )}
                    {currentValues.length > maxReferenceDisplay && maxReferenceDisplay > 0 && (
                        <span className="srs-extra">{`(+ ${currentValues.length - maxReferenceDisplay})`}</span>
                    )}
                </div>
            )}
            {referenceSetStyle === "commas" && currentValues !== undefined && currentValues.length > 0 && (
                <div className="srs-badge-row">
                    {maxReferenceDisplay > 0 && (
                        <Fragment>
                            {currentValues.slice(0, maxReferenceDisplay).map((currentValue: ObjectItem, index) => (
                                <Fragment key={index}>
                                    <Comma
                                        content={currentValue}
                                        optionTextType={optionTextType}
                                        displayAttribute={displayAttribute}
                                        showComma={
                                            index < currentValues.length - 1 && index !== maxReferenceDisplay - 1
                                        }
                                        optionCustomContent={optionCustomContent}
                                    />
                                </Fragment>
                            ))}
                        </Fragment>
                    )}
                    {maxReferenceDisplay <= 0 && (
                        <Fragment>
                            {currentValues.map((currentValue: ObjectItem, index) => (
                                <Fragment key={index}>
                                    <Comma
                                        content={currentValue}
                                        optionTextType={optionTextType}
                                        displayAttribute={displayAttribute}
                                        showComma={
                                            index < currentValues.length - 1 && index !== maxReferenceDisplay - 1
                                        }
                                        optionCustomContent={optionCustomContent}
                                    />
                                </Fragment>
                            ))}
                        </Fragment>
                    )}

                    {currentValues.length > maxReferenceDisplay && maxReferenceDisplay > 0 && (
                        <span className="srs-extra">{`(+ ${currentValues.length - maxReferenceDisplay})`}</span>
                    )}
                </div>
            )}
        </Fragment>
    );
}
