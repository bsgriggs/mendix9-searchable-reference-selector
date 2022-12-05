import React, { createElement, ReactElement } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon, ListActionValue } from "mendix";
import ClearIcon from "./icons/ClearIcon";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import displayContent from "src/utils/displayContent";

interface BadgeProps {
    content: ObjectItem;
    isClearable: boolean;
    isReadOnly: boolean;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent: ListWidgetValue|undefined;
    onRemoveAssociation: () => void;
    displayAttribute?: ListAttributeValue<string>;
    clearIcon?: DynamicValue<WebIcon>;
    onBadgeClick?: ListActionValue;
}

const Badge = ({
    content,
    isClearable,
    isReadOnly,
    onRemoveAssociation,
    optionTextType,
    clearIcon,
    displayAttribute,
    onBadgeClick,
    optionCustomContent
}: BadgeProps): ReactElement => {
    const handleBadgeClick = (event: React.MouseEvent<HTMLSpanElement>): void => {
        event.stopPropagation();
        if (onBadgeClick !== undefined) {
            const badgeClickAction = onBadgeClick.get(content);
            if (badgeClickAction.canExecute && badgeClickAction.isExecuting === false) {
                badgeClickAction.execute();
            }
        }
    };

    return (
        <div className="srs-badge" onClick={handleBadgeClick}>
            {displayContent(content, optionTextType, displayAttribute, optionCustomContent)}
            {isClearable && isReadOnly === false && (
                <ClearIcon
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                        event.stopPropagation();
                        onRemoveAssociation();
                    }}
                    title="Remove"
                    mxIconOverride={clearIcon}
                />
            )}
        </div>
    );
};

export default Badge;
