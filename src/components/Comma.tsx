import { createElement, ReactElement } from "react";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import displayContent from "src/utils/displayContent";

interface CommaProps {
    content: ObjectItem;
    optionTextType: OptionTextTypeEnum;
    optionCustomContent: ListWidgetValue|undefined;
    displayAttribute?: ListAttributeValue<string>;
    showComma: boolean;
}

const Comma = ({
    content,
    optionTextType,
    showComma,
    displayAttribute,
    optionCustomContent
}: CommaProps): ReactElement => (
    <div className="srs-comma">
        {displayContent(content, optionTextType, displayAttribute, optionCustomContent)}
        {showComma && <span>,</span>}
    </div>
);

export default Comma;
