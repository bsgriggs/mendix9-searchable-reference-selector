import { createElement, Fragment, ReactElement } from "react";
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
    onExtraClick: (() => void) | undefined;
    tabIndex?: number;
    badgeColor: BadgeColorEnum;
    extraAriaLabel: string | undefined;
};

const CurrentValueDisplay = (props: CurrentValueDisplayProps): ReactElement => {
    if (props.currentValue) {
        if (Array.isArray(props.currentValue)) {
            const length = props.currentValue.length;
            if (length > 0) {
                return (
                    <Fragment>
                        {props.referenceSetStyle === "badges" && length > 0 && (
                            <Fragment>
                                {props.maxReferenceDisplay > 0
                                    ? props.currentValue.slice(0, props.maxReferenceDisplay).map((option, index) => (
                                          <Badge
                                              index={index}
                                              key={index}
                                              isClearable={props.isClearable}
                                              isReadOnly={props.isReadOnly}
                                              onRemoveAssociation={byKeyboard => props.onRemove(option, byKeyboard)}
                                              clearIcon={props.clearIcon}
                                              clearIconTitle={props.clearIconTitle}
                                              onBadgeClick={props.onBadgeClick}
                                              option={option}
                                              //   tabIndex={props.tabIndex}
                                              badgeColor={props.badgeColor}
                                          />
                                      ))
                                    : props.currentValue.map((option, index) => (
                                          <Badge
                                              index={index}
                                              key={index}
                                              isClearable={props.isClearable}
                                              isReadOnly={props.isReadOnly}
                                              onRemoveAssociation={byKeyboard => props.onRemove(option, byKeyboard)}
                                              clearIcon={props.clearIcon}
                                              clearIconTitle={props.clearIconTitle}
                                              onBadgeClick={props.onBadgeClick}
                                              option={option}
                                              //   tabIndex={props.tabIndex}
                                              badgeColor={props.badgeColor}
                                          />
                                      ))}
                            </Fragment>
                        )}
                        {props.referenceSetStyle === "commas" && length > 0 && (
                            <Fragment>
                                {props.maxReferenceDisplay > 0
                                    ? props.currentValue.slice(0, props.maxReferenceDisplay).map((option, index) => (
                                          <Comma
                                              index={index}
                                              key={index}
                                              option={option}
                                              showComma={index < length - 1 && index !== props.maxReferenceDisplay - 1}
                                              onBadgeClick={props.onBadgeClick}
                                              //   tabIndex={props.tabIndex}
                                          />
                                      ))
                                    : props.currentValue.map((option, index) => (
                                          <Comma
                                              index={index}
                                              key={index}
                                              option={option}
                                              showComma={index < length - 1 && index !== props.maxReferenceDisplay - 1}
                                              onBadgeClick={props.onBadgeClick}
                                              //   tabIndex={props.tabIndex}
                                          />
                                      ))}
                            </Fragment>
                        )}
                        {length > props.maxReferenceDisplay && props.maxReferenceDisplay > 0 && (
                            <span
                                id="extra"
                                className="srs-comma"
                                tabIndex={props.onExtraClick ? -1 : undefined}
                                aria-label={props.extraAriaLabel}
                                onClick={event => {
                                    if (props.onExtraClick) {
                                        event.stopPropagation();
                                        props.onExtraClick();
                                    }
                                }}
                                onKeyDown={event => {
                                    if ((event.key === "Enter" || event.key === " ") && props.onExtraClick) {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        props.onExtraClick();
                                    }
                                }}
                                role={props.onExtraClick ? "button" : undefined}
                            >{`(+ ${length - props.maxReferenceDisplay})`}</span>
                        )}
                    </Fragment>
                );
            }
        } else {
            return <div className="srs-current-value">{props.currentValue.content}</div>;
        }
    }
    return <Fragment />;
};

export default CurrentValueDisplay;
