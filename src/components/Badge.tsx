import React, { createElement, ReactNode } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import CancelIcon from "./CancelIcon";
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
                <div
                    className="srs-icon"
                    onClick={(event: React.MouseEvent<HTMLDivElement>) => {
                        event.stopPropagation();
                        props.onRemoveAssociation();
                    }}
                >
                    <CancelIcon />
                </div>
            )}
        </div>
    );
};

export default Badge;
