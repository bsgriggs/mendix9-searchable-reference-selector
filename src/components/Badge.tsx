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

const Badge = ({
    onRemoveAssociation,
    clearIcon,
    clearIconTitle,
    onBadgeClick,
    option,
    isClearable,
    isReadOnly,
    tabIndex,
    badgeColor
}: BadgeProps): ReactElement => {
    return (
        <div className={`srs-badge label-${badgeColor}`}>
            <div
                tabIndex={onBadgeClick ? tabIndex || 0 : undefined}
                onClick={
                    onBadgeClick
                        ? event => {
                              event.stopPropagation();
                              onBadgeClick(option);
                          }
                        : undefined
                }
                onKeyDown={event => {
                    if (event.key === "Enter" && onBadgeClick) {
                        event.stopPropagation();
                        onBadgeClick(option);
                    }
                }}
                aria-label={option.ariaLiveText}
                role={onBadgeClick ? "button" : undefined}
            >
                {option.badgeContent ? option.badgeContent : option.content}
            </div>

            {isClearable && !isReadOnly && (
                <MxIcon
                    onClick={onRemoveAssociation}
                    title={clearIconTitle + " " + option.ariaLiveText}
                    mxIconOverride={clearIcon}
                    defaultClassName="remove"
                    tabIndex={tabIndex || 0}
                />
            )}
        </div>
    );
};

export default Badge;
