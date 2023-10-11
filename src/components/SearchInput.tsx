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
        <input
            name={props.name} // required for screen readers
            tabIndex={!props.isReadOnly ? props.tabIndex || 0 : undefined}
            style={{
                width:
                    props.hasCurrentValue && !props.isCompact && !props.isReadOnly && props.isSearchable // force the input to the next display flex line
                        ? "100%"
                        : (props.isCompact || (!props.isSearchable && props.hasCurrentValue)) && // For compact or non-searchable modes, make the input take the least amount of space possible until a search text is typed.
                          props.hasCurrentValue &&
                          props.searchFilter.length === 0
                        ? "1px" // cannot use display: none, because the input is needed for screen readers, focusing, and keyboard controls
                        : undefined,
                position:
                    props.isReferenceSet && (props.isCompact || !props.isSearchable) && props.searchFilter.length === 0
                        ? "absolute"
                        : undefined
            }}
            placeholder={
                !props.hasCurrentValue || (props.isReferenceSet && !props.isReadOnly && !props.isCompact)
                    ? props.placeholder
                    : undefined
            } // only show the placeholder for non-compact ref sets or if there is a current value for enums/refs
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
            aria-haspopup // for screen readers
            aria-expanded={props.showMenu} // for screen readers
            role="combobox" // for screen readers
            onClick={event => {
                if (props.showMenu) {
                    event.stopPropagation(); // prevent the click from closing the menu
                }
            }}
            onFocus={props.onFocus}
        ></input>
    );
}
