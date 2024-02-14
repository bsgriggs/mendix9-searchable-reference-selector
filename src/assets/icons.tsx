import { ReactElement, createElement } from "react";

export const DefaultClearIcon: ReactElement = (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="srs-clear-icon"
    >
        <path
            fill="#6f6f6f"
            d="M12.6666 4.27334L11.7266 3.33334L7.99992 7.06001L4.27325 3.33334L3.33325 4.27334L7.05992 8.00001L3.33325 11.7267L4.27325 12.6667L7.99992 8.94001L11.7266 12.6667L12.6666 11.7267L8.93992 8.00001L12.6666 4.27334Z"
        />
    </svg>
);

export const DefaultDropdownIcon: ReactElement = (
    <svg
        width="16"
        height="16"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="srs-dropdown-icon"
    >
        <path fill="#6f6f6f" d="M16 23.41L4.29004 11.71L5.71004 10.29L16 20.59L26.29 10.29L27.71 11.71L16 23.41Z" />
    </svg>
);

export const DefaultSelectAllIcon: ReactElement = (
    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16" className="srs-select-all-icon">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
            fill="#6f6f6f"
            d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"
        />
    </svg>
);
