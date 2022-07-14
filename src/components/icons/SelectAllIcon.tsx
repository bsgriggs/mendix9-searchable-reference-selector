import { createElement } from "react";
import { IconProps } from "typings/IconProps";

const SelectAllIcon = (props: IconProps): JSX.Element => (
    <span className="glyphicon glyphicon-check" aria-hidden="true" onClick={props.onClick} title={props.title} />
);

export default SelectAllIcon;
