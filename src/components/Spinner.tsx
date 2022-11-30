import { createElement, ReactElement } from "react";
import { keyframes, style } from "typestyle";

export type spinnerProps = {
    color: string;
    size: string;
};

const Spinner = ({ color, size }: spinnerProps): ReactElement => {
    const spinner = style({
        width: `${size}`,
        height: `${size}`,
        margin: "0 auto"
    });

    const subSpinner = style({
        content: " ",
        display: "block",
        width: `${size}`,
        height: `${size}`,
        // margin: "8px",
        borderRadius: "50%",
        border: `6px solid ${color}`,
        borderColor: `${color} transparent ${color} transparent`,
        animationName: keyframes({
            "0%": {
                transform: "rotate(0deg)"
            },
            "100%": {
                transform: "rotate(360deg)"
            }
        }),
        animationDuration: "1.2s",
        animationIterationCount: "infinite"
    });

    return (
        <div className={spinner}>
            <div className={subSpinner} />
        </div>
    );
};

export default Spinner;
