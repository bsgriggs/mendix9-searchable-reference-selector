import React from "react";

export interface IconProps {
    onClick?: (event: React.MouseEvent<HTMLSpanElement>) => void;
    title?: string;
}
