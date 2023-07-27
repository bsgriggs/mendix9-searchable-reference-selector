import { createElement, ReactElement } from "react";
import { WebIcon } from "mendix";
import MxIcon from "./MxIcon";
import { IOption } from "typings/option";

interface BadgeProps {
    option: IOption;
    onRemoveAssociation: () => void;
    clearIcon: WebIcon | undefined;
    clearIconTitle: string;
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined;
    isClearable: boolean;
    isReadOnly: boolean;
    tabIndex?: number;
}

const Badge = ({
    onRemoveAssociation,
    clearIcon,
    clearIconTitle,
    onBadgeClick,
    option,
    isClearable,
    isReadOnly,
    tabIndex
}: BadgeProps): ReactElement => {
    return (
        <div className="srs-badge" onClick={() => (onBadgeClick ? onBadgeClick(option) : undefined)}>
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
