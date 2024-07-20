import { createElement, ReactElement, MouseEvent, KeyboardEvent, useCallback } from "react";
import { Icon } from "mendix/components/web/Icon";
import classNames from "classnames";
import { IMxIcon } from "../../typings/general";

interface IconProps {
    id?: string;
    mxIcon: IMxIcon;
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
            id={props.id}
            onClick={onClickHandler}
            onKeyDown={onEnterHandler}
            title={props.title}
            tabIndex={props.tabIndex}
            className={classNames("srs-icon", { "srs-focusable": props.tabIndex !== undefined })}
            role={props.onClick ? "button" : undefined}
        >
            {props.mxIcon?.webIcon ? Icon({ icon: props.mxIcon.webIcon, altText: props.title }) : props.mxIcon.default}
        </div>
    );
};

export default MxIcon;
