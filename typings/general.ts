import { ReactElement } from "react";
import { WebIcon } from "mendix";

export interface IMxIcon {
    webIcon: WebIcon | undefined;
    default: ReactElement;
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
