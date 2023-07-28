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
        <div
            className={`srs-badge label-${badgeColor}`}
            onClick={() => (onBadgeClick ? onBadgeClick(option) : undefined)}
        >
            {option.badgeContent ? option.badgeContent : option.content}
            {isClearable && !isReadOnly && (
                <MxIcon
                    onClick={onRemoveAssociation}
                    title={clearIconTitle}
                    mxIconOverride={clearIcon}
                    defaultClassName="remove"
                    tabIndex={tabIndex || 0}
                />
            )}
        </div>
    );
};

export default Badge;
