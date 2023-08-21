import { createElement, ReactElement, MouseEvent, KeyboardEvent } from "react";
import { WebIcon } from "mendix";
import { Icon } from "mendix/components/web/Icon";
import classNames from "classnames";

interface IconProps {
    defaultClassName: string;
    mxIconOverride: WebIcon | undefined;
    tabIndex?: number;
    onClick?: (byKeyboard: boolean) => void;
    title?: string;
}

const MxIcon = ({ defaultClassName, mxIconOverride, title, onClick, tabIndex }: IconProps): ReactElement => {
    const onClickHandler = (event: MouseEvent<any>): void => {
        if (onClick) {
            event.stopPropagation();
            onClick(false);
        }
    };

    const onEnterHandler = (event: KeyboardEvent<any>): void => {
        if (event.key === "Enter" && onClick) {
            event.stopPropagation();
            onClick(true);
        }
    };

    return (
        <div
            onClick={onClickHandler}
            onKeyDown={onEnterHandler}
            title={title}
            tabIndex={tabIndex}
            className={classNames(defaultClassName, { "srs-icon-focusable": tabIndex !== undefined })}
            role={onClick ? "button" : undefined}
        >
            <Icon icon={mxIconOverride || { type: "glyph", iconClass: `glyphicon-${defaultClassName}` }} />
        </div>
    );
};

export default MxIcon;
