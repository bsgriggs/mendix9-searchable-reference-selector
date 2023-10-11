import { createElement, ReactElement, MouseEvent, KeyboardEvent, useCallback } from "react";
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

const MxIcon = (props: IconProps): ReactElement => {
    const onClickHandler = useCallback(
        (event: MouseEvent<any>): void => {
            if (props.onClick) {
                event.stopPropagation();
                props.onClick(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.onClick]
    );

    const onEnterHandler = useCallback(
        (event: KeyboardEvent<any>): void => {
            if ((event.key === "Enter" || event.key === " ") && props.onClick) {
                event.stopPropagation();
                event.preventDefault();
                props.onClick(true);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.onClick]
    );

    return (
        <div
            onClick={onClickHandler}
            onKeyDown={onEnterHandler}
            title={props.title}
            tabIndex={props.tabIndex}
            className={classNames(props.defaultClassName, { "srs-focusable": props.tabIndex !== undefined })}
            role={props.onClick ? "button" : undefined}
        >
            <Icon icon={props.mxIconOverride || { type: "glyph", iconClass: `glyphicon-${props.defaultClassName}` }} />
        </div>
    );
};

export default MxIcon;
