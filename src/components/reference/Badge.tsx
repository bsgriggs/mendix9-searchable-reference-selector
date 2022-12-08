import { createElement, ReactElement, MouseEvent } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, WebIcon, ListActionValue } from "mendix";
import MxIcon from "../MxIcon";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import displayContent from "src/utils/reference/displayContent";

interface BadgeProps {
    content: ObjectItem;
    isClearable: boolean;
    isReadOnly: boolean;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent: ListWidgetValue | undefined;
    onRemoveAssociation: () => void;
    displayAttribute?: ListAttributeValue<string>;
    clearIcon: WebIcon | undefined;
    onBadgeClick: ListActionValue | undefined;
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
    const handleBadgeClick = (event: MouseEvent<HTMLSpanElement>): void => {
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
                <MxIcon
                    onClick={(event: MouseEvent<HTMLDivElement>) => {
                        event.stopPropagation();
                        onRemoveAssociation();
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
