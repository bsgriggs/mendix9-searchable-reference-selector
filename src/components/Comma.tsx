import { createElement } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import Big from "big.js";
import displayContent from "src/utils/displayContent";

interface CommaProps {
    content: ObjectItem;
    isClearable: boolean;
    isReadOnly: boolean;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent?: ListWidgetValue;
    onRemoveAssociation: () => void;
    displayAttribute?: ListAttributeValue<string | Big>;
    showComma: boolean;
}

const Comma = (props: CommaProps): JSX.Element => {
    return (
        <div className="srs-comma">
            {displayContent(props.content, props.optionTextType, props.displayAttribute, props.optionCustomContent)}
            {props.showComma && <span>,</span>}
        </div>
    );
};

export default Comma;
