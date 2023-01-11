import { createElement, Fragment, ReactElement } from "react";
import { ReferenceSetStyleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import { ListActionValue, WebIcon } from "mendix";
import Badge from "./Badge";
import Comma from "./Comma";
import { IOption } from "typings/option";

type CurrentValueDisplayProps = {
    currentValue: IOption| IOption[] | undefined;
    isClearable: boolean;
    isReadOnly: boolean;
    maxReferenceDisplay: number;
    onRemove: (clickObj: IOption) => void;
    referenceSetStyle: ReferenceSetStyleEnum;
    clearIcon: WebIcon | undefined;
    onBadgeClick: ListActionValue | undefined;
}

export default function CurrentValueDisplay({
    referenceSetStyle,
    maxReferenceDisplay,
    currentValue,
    onRemove,
    clearIcon,
    onBadgeClick,
    isClearable,
    isReadOnly
}: CurrentValueDisplayProps): ReactElement {
    if (currentValue) {
        if (Array.isArray(currentValue)) {
            return (
                <div className={referenceSetStyle === "badges" ? "srs-badge-row" : "srs-comma-row"}>
                    {referenceSetStyle === "badges" && currentValue.length > 0 && (
                        <Fragment>
                            {maxReferenceDisplay > 0 && (
                                <Fragment>
                                    {currentValue.slice(0, maxReferenceDisplay).map((option, key) => (
                                        <Badge
                                            key={key}
                                            isClearable={isClearable || currentValue.length > 1}
                                            isReadOnly={isReadOnly}
                                            onRemoveAssociation={() => onRemove(option)}
                                            clearIcon={clearIcon}
                                            onBadgeClick={onBadgeClick}
                                            option={option}
                                        />
                                    ))}
                                </Fragment>
                            )}
                            {maxReferenceDisplay <= 0 && (
                                <Fragment>
                                    {currentValue.map((option, key) => (
                                        <Badge
                                            key={key}
                                            isClearable={isClearable || currentValue.length > 1}
                                            isReadOnly={isReadOnly}
                                            onRemoveAssociation={() => onRemove(option)}
                                            clearIcon={clearIcon}
                                            onBadgeClick={onBadgeClick}
                                            option={option}
                                        />
                                    ))}
                                </Fragment>
                            )}
                        </Fragment>
                    )}
                    {referenceSetStyle === "commas" && currentValue.length > 0 && (
                        <Fragment>
                            {maxReferenceDisplay > 0 && (
                                <Fragment>
                                    {currentValue.slice(0, maxReferenceDisplay).map((option, index) => (
                                        <Fragment key={index}>
                                            <Comma
                                                option={option}
                                                showComma={
                                                    index < currentValue.length - 1 && index !== maxReferenceDisplay - 1
                                                }
                                            />
                                        </Fragment>
                                    ))}
                                </Fragment>
                            )}
                            {maxReferenceDisplay <= 0 && (
                                <Fragment>
                                    {currentValue.map((option, index) => (
                                        <Fragment key={index}>
                                            <Comma
                                                option={option}
                                                showComma={
                                                    index < currentValue.length - 1 && index !== maxReferenceDisplay - 1
                                                }
                                            />
                                        </Fragment>
                                    ))}
                                </Fragment>
                            )}
                        </Fragment>
                    )}
                    {currentValue.length > maxReferenceDisplay && maxReferenceDisplay > 0 && (
                        <span className="srs-extra">{`(+ ${currentValue.length - maxReferenceDisplay})`}</span>
                    )}
                </div>
            );
        } else {
            return <div className="srs-current-value">
                {currentValue.content}
            </div>
        }
    } 
    return <Fragment/>
}
