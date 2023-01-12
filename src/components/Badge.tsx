import { createElement, ReactElement, MouseEvent } from "react";
import { WebIcon } from "mendix";
import MxIcon from "./MxIcon";
import { IOption } from "typings/option";

interface BadgeProps {
    option: IOption;
    onRemoveAssociation: (selectedOption: IOption) => void;
    clearIcon: WebIcon | undefined;
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined;
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
    return (
        <div className="srs-badge" onClick={() => (onBadgeClick ? onBadgeClick(option) : undefined)}>
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
