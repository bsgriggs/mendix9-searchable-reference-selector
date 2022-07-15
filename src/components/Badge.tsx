import React, { createElement, ReactNode } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue, DynamicValue, WebIcon } from "mendix";
import ClearIcon from "./icons/ClearIcon";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import Big from "big.js";

interface BadgeProps {
    content: ObjectItem;
    isClearable: boolean;
    isReadOnly: boolean;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    onRemoveAssociation: () => void;
    displayAttribute: ListAttributeValue<string | Big>;
    clearIcon?: DynamicValue<WebIcon>;
}

const Badge = (props: BadgeProps) => {
    const displayContent = (): ReactNode => {
        if (props.content !== undefined) {
            switch (props.optionTextType) {
                case "text":
                    return <span>{props.displayAttribute.get(props.content).value?.toString()}</span>;
                case "html":
                    return (
                        <span
                            dangerouslySetInnerHTML={{
                                __html: `${props.displayAttribute.get(props.content).value?.toString()}`
                            }}
                        ></span>
                    );
                case "custom":
                    return <span>{props.optionCustomContent?.get(props.content)}</span>;
            }
        }
    };

    return (
        <div className="srs-badge">
            {displayContent()}
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
