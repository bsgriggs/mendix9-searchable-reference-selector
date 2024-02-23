import { FunctionComponent, createElement, ReactElement } from "react";
export interface AlertProps {
    alertStyle?: "default" | "primary" | "success" | "info" | "warning" | "danger";
    className?: string;
}
export const Alert: FunctionComponent<AlertProps> = ({ alertStyle, children }): ReactElement | null =>
    children ? (
        <div className="alert-wrapper srs-alert" role="alert">
            <div className={`alert alert-${alertStyle} mx-validation-message`}>{children}</div>
        </div>
    ) : null;
Alert.displayName = "Alert";
Alert.defaultProps = { alertStyle: "danger" };
