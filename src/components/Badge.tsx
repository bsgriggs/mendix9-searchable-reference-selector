import { createElement, ReactElement } from "react";
import MxIcon from "./MxIcon";
import { IOption } from "typings/option";
import { BadgeColorEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import classNames from "classnames";
import { IMxIcon } from "../../typings/general";

interface BadgeProps {
    index: number;
    option: IOption;
    onRemoveAssociation: (byKeyboard: boolean) => void;
    clearIcon: IMxIcon;
    clearIconTitle: string;
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined;
    isClearable: boolean;
    isReadOnly: boolean;
    badgeColor: BadgeColorEnum;
}

const Badge = (props: BadgeProps): ReactElement => (
    <div className={classNames(`srs-badge label-${props.badgeColor}`, props.option.className)}>
        <div
            id={`badge-content-${props.index}`}
            tabIndex={-1}
            className={classNames({ "srs-focusable": props.onBadgeClick })}
            onClick={event => {
                if (props.onBadgeClick) {
                    event.stopPropagation();
                    props.onBadgeClick(props.option);
                }
            }}
            onKeyDown={event => {
                if ((event.key === "Enter" || event.key === " ") && props.onBadgeClick) {
                    event.stopPropagation();
                    event.preventDefault();
                    props.onBadgeClick(props.option);
                }
            }}
            aria-label={props.option.valueAriaLabel}
            role={props.onBadgeClick ? "button" : undefined}
        >
            {props.option.badgeContent ? props.option.badgeContent : props.option.content}
        </div>
        {props.isClearable && !props.isReadOnly && (
            <MxIcon
                id={`badge-remove-${props.index}`}
                onClick={props.onRemoveAssociation}
                title={props.clearIconTitle + " " + props.option.ariaLiveText}
                mxIcon={props.clearIcon}
                tabIndex={-1}
            />
        )}
    </div>
);

export default Badge;
