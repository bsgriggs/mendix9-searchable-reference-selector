import { createElement, ReactElement, PropsWithChildren } from "react";

export interface AlertProps {
    id?: string;
    alertStyle?: "default" | "primary" | "success" | "info" | "warning" | "danger";
    className?: string;
}

const Alert = ({ id, alertStyle = "danger", children, className }: PropsWithChildren<AlertProps>): ReactElement => {
    return (
        <div id={id} className={`alert alert-${alertStyle} mx-validation-message ${className}`}>
            {children}
        </div>
    );
};

export default Alert;
