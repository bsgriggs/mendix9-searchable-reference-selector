import { createElement, ReactElement } from "react";
import { IOption } from "typings/option";

interface CommaProps {
    showComma: boolean;
    option: IOption;
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined;
    tabIndex?: number;
}

const Comma = (props: CommaProps): ReactElement => (
    <div
        className="srs-comma"
        tabIndex={props.onBadgeClick ? props.tabIndex || 0 : undefined}
        onClick={event => {
            if (props.onBadgeClick) {
                event.stopPropagation();
                props.onBadgeClick(props.option);
            }
        }}
        onKeyDown={event => {
            if (event.key === "Enter" && props.onBadgeClick) {
                event.stopPropagation();
                props.onBadgeClick(props.option);
            }
        }}
        aria-label={props.option.ariaLiveText}
        role={props.onBadgeClick ? "button" : undefined}
    >
        {props.option.badgeContent ? props.option.badgeContent : props.option.content}
        {props.showComma && <span>,</span>}
    </div>
);

export default Comma;
