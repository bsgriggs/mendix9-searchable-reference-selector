import { createElement, ReactElement, MouseEvent, KeyboardEvent } from "react";
import { WebIcon } from "mendix";
import { Icon } from "mendix/components/web/Icon";

interface IconProps {
    defaultClassName: string;
    mxIconOverride: WebIcon | undefined;
    tabIndex?: number;
    onClick?: () => void;
    title?: string;
}

const MxIcon = ({ defaultClassName, mxIconOverride, title, onClick, tabIndex }: IconProps): ReactElement => {
    const onClickHandler = (event: MouseEvent<any>): void => {
        event.stopPropagation();
        if (onClick) {
            onClick();
        }
    };

    const onEnterHandler = (event: KeyboardEvent<any>): void => {
        event.stopPropagation();
        if (event.key === "Enter" && onClick) {
            onClick();
        }
    };

    return mxIconOverride !== undefined ? (
        <div onClick={onClickHandler} onKeyDown={onEnterHandler} title={title} tabIndex={tabIndex}>
            <Icon icon={mxIconOverride} altText={title} />
        </div>
    ) : (
        <span
            onClick={onClickHandler}
            onKeyDown={onEnterHandler}
            tabIndex={tabIndex}
            className={`glyphicon glyphicon-${defaultClassName}`}
            aria-hidden="true"
            title={title}
        />
    );
};

export default MxIcon;
