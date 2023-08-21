import { createElement, ReactElement } from "react";
import { IOption } from "typings/option";

interface CommaProps {
    showComma: boolean;
    option: IOption;
    onBadgeClick: ((selectedBadge: IOption) => void) | undefined;
    tabIndex?: number;
}

const Comma = ({ showComma, option, onBadgeClick, tabIndex }: CommaProps): ReactElement => (
    <div
        className="srs-comma"
        tabIndex={onBadgeClick ? tabIndex || 0 : undefined}
        onClick={
            onBadgeClick
                ? event => {
                      event.stopPropagation();
                      onBadgeClick(option);
                  }
                : undefined
        }
        onKeyDown={event => {
            if (event.key === "Enter" && onBadgeClick) {
                event.stopPropagation();
                onBadgeClick(option);
            }
        }}
        aria-label={option.ariaLiveText}
        role={onBadgeClick ? "button" : undefined}
    >
        {option.badgeContent ? option.badgeContent : option.content}
        {showComma && <span>,</span>}
    </div>
);

export default Comma;
