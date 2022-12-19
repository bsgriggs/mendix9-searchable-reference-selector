// import { createElement, ReactElement } from "react";
// import { keyframes, style } from "typestyle";

// type LoadingDotProps = {
//     delay: number;
// };

// const LoadingDot = ({ delay }: LoadingDotProps): ReactElement => {
//     const loadingDot = style({
//         animationName: keyframes({
//             "0%": {
//                 opacity: 1
//             },
//             "50%": {
//                 opacity: 0.5
//             },
//             "100%": {
//                 opacity: 1
//             }
//         }),
//         animationDuration: "1.2s",
//         animationDelay: `${delay}s`,
//         animationIterationCount: "infinite",
//         animationTimingFunction: "ease-in-out"
//     });

//     return <div className={"srs-loading-dot " + loadingDot} />;
// };

// const LoadingIndicator = (): ReactElement => {
//     return (
//         <div className="srs-loading-indicator">
//             <LoadingDot delay={0} />
//             <LoadingDot delay={0.4} />
//             <LoadingDot delay={0.8} />
//         </div>
//     );
// };

// export default LoadingIndicator;
