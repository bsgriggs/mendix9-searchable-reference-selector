import { ChangeEvent, createElement, ReactElement, useEffect, useRef } from "react";

interface SearchInputProps {
    id: string;
    name: string;
    ariaLabel: string | undefined;
    placeholder: string | undefined;
    searchFilter: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    isReadOnly: boolean;
    isSearchable: boolean;
    setRef: (newRef: HTMLInputElement) => void;
    showMenu: boolean;
    hasCurrentValue: boolean;
    isReferenceSet: boolean;
    tabIndex?: number;
    isCompact: boolean;
    onFocus: () => void;
    ariaRequired: boolean;
}

export default function SearchInput(props: SearchInputProps): ReactElement {
    const searchInput = useRef<HTMLInputElement>(null);
    // pass the ref back up for focus controls
    useEffect(() => {
        if (searchInput !== null && searchInput.current !== null) {
            props.setRef(searchInput.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput, props.setRef]);

    return (
        <div
            data-value={props.isCompact && !props.hasCurrentValue ? props.placeholder : props.searchFilter}
            className="srs-input-container"
        >
            <input
                name={props.name} // required for screen readers
                tabIndex={!props.isReadOnly ? props.tabIndex || 0 : undefined}
                className="srs-input"
                placeholder={!props.isCompact || !props.hasCurrentValue ? props.placeholder : undefined} // only show the placeholder for non-compact ref sets or if there is a current value for enums/refs
                type="text"
                onChange={props.onChange}
                readOnly={props.isReadOnly || !props.isSearchable}
                disabled={props.isReadOnly}
                value={props.searchFilter}
                ref={searchInput} // for focus controls
                autoComplete="off"
                aria-labelledby={
                    props.ariaLabel === undefined || props.ariaLabel.trim() === "" ? props.id + "-label" : undefined
                } // for screen readers
                aria-label={props.ariaLabel} // for screen readers
                aria-haspopup={props.showMenu ? "true" : "false"} // for screen readers
                aria-expanded={props.showMenu} // for screen readers
                aria-controls={props.id + "-listbox"}
                aria-required={props.ariaRequired ? "true" : "false"}
                role="combobox" // for screen readers
                onClick={event => {
                    if (props.showMenu) {
                        event.stopPropagation(); // prevent the click from closing the menu
                    }
                }}
                onFocus={props.onFocus}
            ></input>
        </div>
    );
}
