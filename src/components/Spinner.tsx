import { createElement } from "react";
import { keyframes, style } from "typestyle";

export type spinnerProps = {
    color: string;
    size: string;
};

const Spinner = (props: spinnerProps): JSX.Element => {
    const spinner = style({
        width: `${props.size}`,
        height:`${props.size}`,
        margin: "0 auto"
    });

    const subSpinner = style({
        content: " ",
        display: "block",
        width: `${props.size}`,
        height: `${props.size}`,
        // margin: "8px",
        borderRadius: "50%",
        border: `6px solid ${props.color}`,
        borderColor: `${props.color} transparent ${props.color} transparent`,
        animationName: keyframes({
            "0%": {
                transform: "rotate(0deg)",
            },
            "100%": {
                transform: "rotate(360deg)",
            }
        }),
        animationDuration: '1.2s',
        animationIterationCount: 'infinite'
    })

    return <div className={spinner}>
        <div className={subSpinner}/>
    </div>;
};

export default Spinner;