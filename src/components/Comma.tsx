import { createElement, ReactElement } from "react";
import { IOption } from "typings/option";

interface CommaProps {
    showComma: boolean;
    option: IOption;
}

const Comma = ({ showComma, option }: CommaProps): ReactElement => (
    <div className="srs-comma">
        {option.content}
        {showComma && <span>,</span>}
    </div>
);

export default Comma;
