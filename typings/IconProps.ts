import React from "react";
import { DynamicValue, WebIcon } from "mendix";

export interface IconProps {
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    title?: string;
    mxIconOverride?: DynamicValue<WebIcon>;
}
