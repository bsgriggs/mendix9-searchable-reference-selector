import { createElement, ReactNode } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import Big from "big.js";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";

export default function displayContent(
    displayObj: ObjectItem,
    optionTextType: OptionTextTypeEnum,
    displayAttribute?: ListAttributeValue<string | Big>,
    optionCustomContent?: ListWidgetValue,
    className?: string
): ReactNode {
    if (displayAttribute !== undefined) {
        if (optionTextType === "text") {
            return <span className={className}>{displayAttribute.get(displayObj).value?.toString()}</span>;
        } else if (optionTextType === "html") {
            return (
                <span
                    className={className}
                    dangerouslySetInnerHTML={{
                        __html: `${displayAttribute.get(displayObj).value?.toString()}`
                    }}
                ></span>
            );
        }
    }
    if (optionTextType === "custom" && optionCustomContent !== undefined) {
        return <span className={className}>{optionCustomContent?.get(displayObj)}</span>;
    } else {
        return <span className={className}>No Content</span>;
    }
}
