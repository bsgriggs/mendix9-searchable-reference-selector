import React, { createElement, ReactElement } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon, ListActionValue } from "mendix";
import ClearIcon from "./icons/ClearIcon";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import Big from "big.js";
import displayContent from "src/utils/displayContent";

interface BadgeProps {
    content: ObjectItem;
    isClearable: boolean;
    isReadOnly: boolean;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    onRemoveAssociation: () => void;
    displayAttribute?: ListAttributeValue<string | Big>;
    clearIcon?: DynamicValue<WebIcon>;
    onBadgeClick?: ListActionValue;
}

const Badge = (props: BadgeProps): ReactElement => {
    const handleBadgeClick = (event: React.MouseEvent<HTMLSpanElement>): void => {
        event.stopPropagation();
        if (props.onBadgeClick !== undefined) {
            const badgeClickAction = props.onBadgeClick.get(props.content);
            if (badgeClickAction.canExecute && badgeClickAction.isExecuting === false) {
                badgeClickAction.execute();
            }
        }
    };

    return (
        <div className="srs-badge" onClick={handleBadgeClick}>
            {displayContent(props.content, props.optionTextType, props.displayAttribute, props.optionCustomContent)}
            {props.isClearable && props.isReadOnly === false && (
                <ClearIcon
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                        event.stopPropagation();
                        props.onRemoveAssociation();
                    }}
                    title="Remove"
                    mxIconOverride={props.clearIcon}
                />
            )}
        </div>
    );
};

export default Badge;
