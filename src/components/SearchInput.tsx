import { ChangeEvent, createElement, Fragment, ReactElement, useEffect, useRef, MouseEvent } from "react";

interface SearchInputProps {
    name: string | undefined;
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
    hasCurrentValue,
    isReferenceSet,
    tabIndex
}: SearchInputProps): ReactElement {
    const searchInput = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (searchInput !== null && searchInput.current !== null) {
            setRef(searchInput.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    return (
        <Fragment>
            <input
                style={{
                    caretColor: !isReferenceSet && hasCurrentValue && searchFilter === "" ? "transparent" : "",
                    gridRow: isReferenceSet ? 2 : 1
                }}
                tabIndex={!isReadOnly ? tabIndex || 0 : undefined}
                name={name}
                placeholder={!hasCurrentValue || (isReferenceSet && !isReadOnly)? placeholder : ""}
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
            ></input>
        </Fragment>
    );
}
