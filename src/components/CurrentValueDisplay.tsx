import { createElement, Fragment, ReactElement, useMemo } from "react";
import { BadgeColorEnum, ReferenceSetStyleEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import { WebIcon } from "mendix";
import Badge from "./Badge";
import Comma from "./Comma";
import { IOption } from "typings/option";

type CurrentValueDisplayProps = {
    currentValue: IOption | IOption[] | undefined;
    isClearable: boolean;
    isReadOnly: boolean;
    maxReferenceDisplay: number;
    onRemove: (clickObj: IOption, byKeyboard: boolean) => void;
    referenceSetStyle: ReferenceSetStyleEnum;
    clearIcon: WebIcon | undefined;
    clearIconTitle: string;
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined;
    tabIndex?: number;
    isCompact: boolean;
    badgeColor: BadgeColorEnum;
};

export default function CurrentValueDisplay({
    referenceSetStyle,
    maxReferenceDisplay,
    currentValue,
    onRemove,
    clearIcon,
    clearIconTitle,
    onBadgeClick,
    isClearable,
    isReadOnly,
    tabIndex,
    isCompact,
    badgeColor
}: CurrentValueDisplayProps): ReactElement {
    const currentValueDisplay = useMemo(() => {
        if (currentValue) {
            if (Array.isArray(currentValue)) {
                if (currentValue.length > 0) {
                    const refSetCurrentValue = (
                        <Fragment>
                            {referenceSetStyle === "badges" && currentValue.length > 0 && (
                                <Fragment>
                                    {maxReferenceDisplay > 0 &&
                                        currentValue
                                            .slice(0, maxReferenceDisplay)
                                            .map((option, key) => (
                                                <Badge
                                                    key={key}
                                                    isClearable={isClearable}
                                                    isReadOnly={isReadOnly}
                                                    onRemoveAssociation={byKeyboard => onRemove(option, byKeyboard)}
                                                    clearIcon={clearIcon}
                                                    clearIconTitle={clearIconTitle}
                                                    onBadgeClick={onBadgeClick}
                                                    option={option}
                                                    tabIndex={tabIndex}
                                                    badgeColor={badgeColor}
                                                />
                                            ))}
                                    {maxReferenceDisplay <= 0 &&
                                        currentValue.map((option, key) => (
                                            <Badge
                                                key={key}
                                                isClearable={isClearable}
                                                isReadOnly={isReadOnly}
                                                onRemoveAssociation={byKeyboard => onRemove(option, byKeyboard)}
                                                clearIcon={clearIcon}
                                                clearIconTitle={clearIconTitle}
                                                onBadgeClick={onBadgeClick}
                                                option={option}
                                                tabIndex={tabIndex}
                                                badgeColor={badgeColor}
                                            />
                                        ))}
                                </Fragment>
                            )}
                            {referenceSetStyle === "commas" && currentValue.length > 0 && (
                                <Fragment>
                                    {maxReferenceDisplay > 0 &&
                                        currentValue
                                            .slice(0, maxReferenceDisplay)
                                            .map((option, index) => (
                                                <Comma
                                                    key={index}
                                                    option={option}
                                                    showComma={
                                                        index < currentValue.length - 1 &&
                                                        index !== maxReferenceDisplay - 1
                                                    }
                                                />
                                            ))}
                                    {maxReferenceDisplay <= 0 &&
                                        currentValue.map((option, index) => (
                                            <Comma
                                                key={index}
                                                option={option}
                                                showComma={
                                                    index < currentValue.length - 1 && index !== maxReferenceDisplay - 1
                                                }
                                            />
                                        ))}
                                </Fragment>
                            )}
                            {currentValue.length > maxReferenceDisplay && maxReferenceDisplay > 0 && (
                                <span className="srs-comma">{`(+ ${currentValue.length - maxReferenceDisplay})`}</span>
                            )}
                        </Fragment>
                    );

                    return isCompact ? (
                        refSetCurrentValue
                    ) : (
                        <div className={referenceSetStyle === "badges" ? "srs-badge-row" : "srs-comma-row"}>
                            {refSetCurrentValue}
                        </div>
                    );
                }
            } else {
                return <div className="srs-current-value">{currentValue.content}</div>;
            }
        }
        return <Fragment />;
    }, [currentValue, clearIconTitle, isReadOnly]);

    return currentValueDisplay;
}
