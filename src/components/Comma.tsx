import { createElement, ReactNode } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import Big from "big.js";

interface CommaProps {
    content: ObjectItem;
    isClearable: boolean;
    isReadOnly: boolean;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    onRemoveAssociation: () => void;
    displayAttribute: ListAttributeValue<string | Big>;
}

const Comma = (props: CommaProps): JSX.Element => {
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

    return <div className="srs-comma">{displayContent()}</div>;
};

export default Comma;
