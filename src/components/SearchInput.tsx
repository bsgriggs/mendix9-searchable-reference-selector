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
    useEffect(() => {
        if (searchInput !== null && searchInput.current !== null) {
            setRef(searchInput.current);
        }
    }, [searchInput, setRef]);

    return (
        <input
            name={name}
            tabIndex={!isReadOnly ? tabIndex || 0 : undefined}
            style={{
                width: isCompact && hasCurrentValue && searchFilter.length === 0 ? "10px" : undefined
            }}
            placeholder={!hasCurrentValue || (isReferenceSet && !isReadOnly && !isCompact) ? placeholder : undefined}
            type="text"
            onChange={event => onChange(event)}
            readOnly={isReadOnly || !isSearchable}
            disabled={isReadOnly}
            value={searchFilter}
            ref={searchInput}
            autoComplete="off"
            aria-labelledby={id + "-label"}
            aria-haspopup
            aria-expanded={showMenu}
            role="combobox"
            onClick={(event: MouseEvent<HTMLInputElement>) => {
                if (showMenu) {
                    event.stopPropagation();
                }
            }}
            onFocus={() => {
                if (!showMenu) {
                    setShowMenu(true);
                }
            }}
        ></input>
    );
}
