export default function focusSearchInput(input: HTMLInputElement| null, delay: number): void {
    if (input !== null) {
        if (delay !== undefined) {
            setTimeout(() => input?.focus(), delay);
        } else {
            input.focus();
        }
    }
}
