import { createElement, ReactElement } from "react";
import { WebIcon } from "mendix";
import MxIcon from "./MxIcon";
import { IOption } from "typings/option";
import { BadgeColorEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import classNames from "classnames";

interface BadgeProps {
    index: number;
    option: IOption;
    onRemoveAssociation: (byKeyboard: boolean) => void;
    clearIcon: WebIcon | undefined;
    clearIconTitle: string;
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined;
    isClearable: boolean;
    isReadOnly: boolean;
    // tabIndex?: number;
    badgeColor: BadgeColorEnum;
}

const Badge = (props: BadgeProps): ReactElement => (
    <div className={`srs-badge label-${props.badgeColor}`}>
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
                mxIconOverride={props.clearIcon}
                defaultClassName="remove"
                tabIndex={-1}
            />
        )}
    </div>
);

export default Badge;
