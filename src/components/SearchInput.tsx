import { ChangeEvent, createElement, ReactElement, useEffect, useRef, MouseEvent } from "react";

interface SearchInputProps {
    name: string | undefined;
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
}

export default function SearchInput({
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
    tabIndex
}: SearchInputProps): ReactElement {
    const searchInput = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (searchInput !== null && searchInput.current !== null) {
            setRef(searchInput.current);
        }
    }, [searchInput, setRef]);

    return (
        <input
            style={{
                gridRow: isReferenceSet ? 2 : 1,
                cursor: !isReadOnly && !isSearchable && !hasCurrentValue ? "pointer" : "unset"
            }}
            tabIndex={!isReadOnly ? tabIndex || 0 : undefined}
            name={name}
            placeholder={!hasCurrentValue || (isReferenceSet && !isReadOnly) ? placeholder : ""}
            type="text"
            onChange={event => onChange(event)}
            readOnly={isReadOnly || !isSearchable}
            disabled={isReadOnly}
            value={searchFilter}
            ref={searchInput}
            autoComplete="off"
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
