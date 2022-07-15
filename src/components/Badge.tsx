import React, { createElement } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon } from "mendix";
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
}

const Badge = (props: BadgeProps): JSX.Element => {
    return (
        <div className="srs-badge">
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
