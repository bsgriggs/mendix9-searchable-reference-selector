import { createElement, ReactElement, MouseEvent } from "react";
import { ObjectItem, WebIcon, ListActionValue } from "mendix";
import MxIcon from "../MxIcon";
import { IOption } from "typings/option";

interface BadgeProps {
    option: IOption;
    onRemoveAssociation: (selectedOption: IOption) => void;
    clearIcon: WebIcon | undefined;
    onBadgeClick: ListActionValue | undefined;
    isClearable: boolean;
    isReadOnly: boolean;
}

const Badge = ({
    onRemoveAssociation,
    clearIcon,
    onBadgeClick,
    option,
    isClearable,
    isReadOnly
}: BadgeProps): ReactElement => {
    const handleBadgeClick = (event: MouseEvent<HTMLSpanElement>): void => {
        event.stopPropagation();
        if (onBadgeClick !== undefined) {
            const badgeClickAction = onBadgeClick.get(option.id as ObjectItem);
            if (badgeClickAction.canExecute && badgeClickAction.isExecuting === false) {
                badgeClickAction.execute();
            }
        }
    };

    return (
        <div className="srs-badge" onClick={handleBadgeClick}>
            {option.content}
            {isClearable && !isReadOnly && (
                <MxIcon
                    onClick={(event: MouseEvent<HTMLDivElement>) => {
                        event.stopPropagation();
                        onRemoveAssociation(option);
                    }}
                    title="Remove"
                    mxIconOverride={clearIcon}
                    defaultClassName="remove"
                />
            )}
        </div>
    );
};

export default Badge;
