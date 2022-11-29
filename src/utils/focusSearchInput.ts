import { RefObject } from "react";

export default function focusSearchInput(input: RefObject<HTMLInputElement>, delay: number): void {
    if (input.current !== null) {
        if (delay !== undefined) {
            setTimeout(() => input.current?.focus(), delay);
        } else {
            input.current.focus();
        }
    }
}
