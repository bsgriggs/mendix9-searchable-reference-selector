import { createElement, ReactNode } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";

export const displayTextContent = (text: string, classOverride?: string): ReactNode => {
    return <span className={classOverride}>{text}</span>;
};

export const displayReferenceContent = (
    displayObj: ObjectItem,
    optionTextType: OptionTextTypeEnum,
    displayAttribute: ListAttributeValue<string> | undefined,
    optionCustomContent?: ListWidgetValue,
    classOverride?: string
): ReactNode => {
    if (displayAttribute !== undefined) {
        if (optionTextType === "text") {
            return <span className={classOverride}>{displayAttribute.get(displayObj).displayValue}</span>;
        } else if (optionTextType === "html") {
            return (
                <span
                    className={classOverride}
                    dangerouslySetInnerHTML={{
                        __html: `${displayAttribute.get(displayObj).value?.toString()}`
                    }}
                ></span>
            );
        }
    }
    if (optionTextType === "custom" && optionCustomContent) {
        return optionCustomContent.get(displayObj);
    }
    return <span className={classOverride}>No Content</span>;
};
