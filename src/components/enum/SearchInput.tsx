import { ChangeEvent, createElement, ReactElement, useEffect, useRef, MouseEvent } from "react";
import { EnumOption } from "typings/general";

interface SearchInputProps {
    name: string | undefined;
    placeholder: string | undefined;
    mxFilter: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    isReadOnly: boolean;
    isSearchable: boolean;
    currentValue: EnumOption | undefined;
    setRef: (newRef: HTMLInputElement) => void;
    showMenu?: boolean;
}

export default function SearchInput({
    name,
    placeholder,
    onChange,
    isReadOnly,
    mxFilter,
    currentValue,
    isSearchable,
    showMenu,
    setRef
}: SearchInputProps): ReactElement {
    const searchInput = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (searchInput !== null && searchInput.current !== null) {
            setRef(searchInput.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);
    return (
        <input
            name={name}
            placeholder={placeholder}
            type="text"
            onChange={event => onChange(event)}
            readOnly={isReadOnly || currentValue !== undefined || !isSearchable}
            disabled={isReadOnly}
            value={currentValue !== undefined ? currentValue.caption : mxFilter}
            ref={searchInput}
            autoComplete="off"
            onClick={(event: MouseEvent<HTMLInputElement>) => {
                if (showMenu !== undefined && showMenu) {
                    event.stopPropagation();
                }
            }}
        ></input>
    );
}
