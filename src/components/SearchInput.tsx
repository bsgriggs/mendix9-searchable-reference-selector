import { ChangeEvent, createElement, ReactElement, useEffect, useRef, MouseEvent } from "react";

interface SearchInputProps {
    id: string;
    name: string;
    placeholder: string | undefined;
    searchFilter: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    isReadOnly: boolean;
    isSearchable: boolean;
    setRef: (newRef: HTMLInputElement) => void;
    showMenu: boolean;
    setShowMenu: (newValue: boolean) => void;
    hasCurrentValue: boolean;
    isReferenceSet: boolean;
    tabIndex?: number;
    isCompact: boolean;
}

export default function SearchInput({
    id,
    name,
    placeholder,
    onChange,
    isReadOnly,
    isSearchable,
    setRef,
    searchFilter,
    showMenu,
    setShowMenu,
    hasCurrentValue,
    isReferenceSet,
    tabIndex,
    isCompact
}: SearchInputProps): ReactElement {
    const searchInput = useRef<HTMLInputElement>(null);
    // pass the ref back up for focus controls
    useEffect(() => {
        if (searchInput !== null && searchInput.current !== null) {
            setRef(searchInput.current);
        }
    }, [searchInput, setRef]);

    return (
        <input
            name={name} // required for screen readers
            tabIndex={!isReadOnly ? tabIndex || 0 : undefined}
            style={{
                width:
                    hasCurrentValue && !isCompact && !isReadOnly && isSearchable // force the input to the next display flex line
                        ? "100%"
                        : (isCompact || (!isSearchable && hasCurrentValue)) && // For compact or non-searchable modes, make the input take the least amount of space possible until a search text is typed.
                          hasCurrentValue &&
                          searchFilter.length === 0
                        ? "1px" // cannot use display: none, because the input is needed for screen readers, focusing, and keyboard controls
                        : undefined,
                height: !isSearchable && hasCurrentValue ? "0px" : undefined
            }}
            placeholder={!hasCurrentValue || (isReferenceSet && !isReadOnly && !isCompact) ? placeholder : undefined} // only show the placeholder for non-compact ref sets or if there is a current value for enums/refs
            type="text"
            onChange={onChange}
            readOnly={isReadOnly || !isSearchable}
            disabled={isReadOnly}
            value={searchFilter}
            ref={searchInput} // for focus controls
            autoComplete="off"
            aria-labelledby={id + "-label"} // for screen readers
            aria-haspopup // for screen readers
            aria-expanded={showMenu} // for screen readers
            role="combobox" // for screen readers
            onClick={(event: MouseEvent<HTMLInputElement>) => {
                if (showMenu) {
                    event.stopPropagation(); // prevent the click from closing the menu
                }
            }}
            onFocus={() => {
                // ensure the menu is showing no matter how the input was focused
                if (!showMenu) {
                    setShowMenu(true);
                }
            }}
        ></input>
    );
}
