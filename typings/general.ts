import { MouseEvent } from "react";
import { DynamicValue, WebIcon } from "mendix";

export interface IconProps {
    onClick?: (event: MouseEvent<HTMLSpanElement>) => void;
    title?: string;
    mxIconOverride?: DynamicValue<WebIcon>;
}

export interface EnumOption {
    caption: string;
    name: string;
}

export enum focusModeEnum {
    // eslint-disable-next-line no-unused-vars
    hover = "hover",
    // eslint-disable-next-line no-unused-vars
    arrow = "arrow"
}
