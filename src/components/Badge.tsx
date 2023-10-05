import { createElement, ReactElement } from "react";
import { WebIcon } from "mendix";
import MxIcon from "./MxIcon";
import { IOption } from "typings/option";
import { BadgeColorEnum } from "typings/SearchableReferenceSelectorMxNineProps";

interface BadgeProps {
    option: IOption;
    onRemoveAssociation: (byKeyboard: boolean) => void;
    clearIcon: WebIcon | undefined;
    clearIconTitle: string;
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined;
    isClearable: boolean;
    isReadOnly: boolean;
    tabIndex?: number;
    badgeColor: BadgeColorEnum;
}

const Badge = (props: BadgeProps): ReactElement => (
    <div className={`srs-badge label-${props.badgeColor}`}>
        <div
            tabIndex={props.onBadgeClick ? props.tabIndex || 0 : undefined}
            onClick={event => {
                if (props.onBadgeClick) {
                    event.stopPropagation();
                    props.onBadgeClick(props.option);
                }
            }}
            onKeyDown={event => {
                if (event.key === "Enter" && props.onBadgeClick) {
                    event.stopPropagation();
                    props.onBadgeClick(props.option);
                }
            }}
            aria-label={props.option.ariaLiveText}
            role={props.onBadgeClick ? "button" : undefined}
        >
            {props.option.badgeContent ? props.option.badgeContent : props.option.content}
        </div>

        {props.isClearable && !props.isReadOnly && (
            <MxIcon
                onClick={props.onRemoveAssociation}
                title={props.clearIconTitle + " " + props.option.ariaLiveText}
                mxIconOverride={props.clearIcon}
                defaultClassName="remove"
                tabIndex={props.tabIndex || 0}
            />
        )}
    </div>
);

export default Badge;
