import { createElement } from "react";
import { IconProps } from "typings/IconProps";
import { Icon } from "mendix/components/web/Icon";

const ClearIcon = (props: IconProps): JSX.Element =>
    props.mxIconOverride !== undefined ? (
        <div onClick={props.onClick} title={props.title}>
            <Icon icon={props.mxIconOverride.value} altText={props.title} />
        </div>
    ) : (
        <span className="glyphicon glyphicon-remove" aria-hidden="true" onClick={props.onClick} title={props.title} />
    );

export default ClearIcon;
