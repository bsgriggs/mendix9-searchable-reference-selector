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
        event.stopPropagation();
        if (onClick) {
            onClick(false);
        }
    };

    const onEnterHandler = (event: KeyboardEvent<any>): void => {
        event.stopPropagation();
        if (event.key === "Enter" && onClick) {
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
        >
            {mxIconOverride !== undefined ? (
                <Icon icon={mxIconOverride} altText={title} />
            ) : (
                <span className={`glyphicon glyphicon-${defaultClassName}`} />
            )}
        </div>
    );
};

export default MxIcon;
