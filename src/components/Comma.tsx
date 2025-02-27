import classNames from "classnames";
import { createElement, ReactElement } from "react";
import { IOption } from "typings/option";

interface CommaProps {
    index: number;
    showComma: boolean;
    option: IOption;
    isReadOnly: boolean;
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined;
}

const Comma = (props: CommaProps): ReactElement => (
    <div
        id={`badge-content-${props.index}`}
        className={classNames(
            "srs-comma",
            { "srs-focusable": props.onBadgeClick && !props.isReadOnly },
            props.option.className
        )}
        tabIndex={-1}
        onClick={event => {
            if (props.onBadgeClick && !props.isReadOnly) {
                event.stopPropagation();
                props.onBadgeClick(props.option);
            }
        }}
        onKeyDown={event => {
            if ((event.key === "Enter" || event.key === " ") && props.onBadgeClick && !props.isReadOnly) {
                event.stopPropagation();
                event.preventDefault();
                props.onBadgeClick(props.option);
            }
        }}
        aria-label={props.option.valueAriaLabel}
        role={props.onBadgeClick && !props.isReadOnly ? "button" : undefined}
    >
        {props.option.badgeContent ? props.option.badgeContent : props.option.content}
        {props.showComma && <span>,</span>}
    </div>
);

export default Comma;
