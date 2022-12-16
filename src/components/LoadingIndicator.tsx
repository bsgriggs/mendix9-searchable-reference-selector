import { createElement, ReactElement } from "react";
import { keyframes, style } from "typestyle";

type LoadingDotProps = {
    delay: number;
};

const LoadingDot = ({ delay }: LoadingDotProps): ReactElement => {
    const loadingDot = style({
        animationName: keyframes({
            "0%": {
                opacity: 1
            },
            "50%": {
                opacity: 0.5
            },
            "100%": {
                opacity: 1
            }
        }),
        animationDuration: "1.2s",
        animationDelay: `${delay}s`,
        animationIterationCount: "infinite",
        animationTimingFunction: "ease-in-out"
    });

    return <div className={"srs-loading-dot " + loadingDot} />;
};

const LoadingIndicator = (): ReactElement => {
    return (
        <div className="srs-loading-indicator">
            <LoadingDot delay={0} />
            <LoadingDot delay={0.4} />
            <LoadingDot delay={0.8} />
        </div>
    );
};

export default LoadingIndicator;

// .dot-flashing {
//     position: relative;
//     width: 10px;
//     height: 10px;
//     border-radius: 5px;
//     background-color: #9880ff;
//     color: #9880ff;
//     animation: dot-flashing 1s infinite linear alternate;
//     animation-delay: 0.5s;
//   }
//   .dot-flashing::before, .dot-flashing::after {
//     content: "";
//     display: inline-block;
//     position: absolute;
//     top: 0;
//   }
//   .dot-flashing::before {
//     left: -15px;
//     width: 10px;
//     height: 10px;
//     border-radius: 5px;
//     background-color: #9880ff;
//     color: #9880ff;
//     animation: dot-flashing 1s infinite alternate;
//     animation-delay: 0s;
//   }
//   .dot-flashing::after {
//     left: 15px;
//     width: 10px;
//     height: 10px;
//     border-radius: 5px;
//     background-color: #9880ff;
//     color: #9880ff;
//     animation: dot-flashing 1s infinite alternate;
//     animation-delay: 1s;
//   }

//   @keyframes dot-flashing {
//     0% {
//       background-color: #9880ff;
//     }
//     50%, 100% {
//       background-color: rgba(152, 128, 255, 0.2);
//     }
//   }
