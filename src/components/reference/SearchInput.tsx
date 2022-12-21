import { ChangeEvent, createElement, Fragment, ReactElement, useEffect, useRef, MouseEvent } from "react";
import displayContent from "src/utils/reference/displayContent";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import { ObjectItem, ListAttributeValue, ListWidgetValue } from "mendix";

interface SearchInputProps {
    name: string | undefined;
    optionTextType: OptionTextTypeEnum;
    placeholder: string | undefined;
    mxFilter: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    isReadOnly: boolean;
    isSearchable: boolean;
    currentValue: ObjectItem | undefined;
    displayAttribute: ListAttributeValue<string> | undefined;
    optionCustomContent: ListWidgetValue | undefined;
    setRef: (newRef: HTMLInputElement) => void;
    showMenu?: boolean;
}

export default function SearchInput({
    name,
    optionTextType,
    placeholder,
    onChange,
    isReadOnly,
    mxFilter,
    currentValue,
    isSearchable,
    displayAttribute,
    showMenu,
    optionCustomContent,
    setRef
}: SearchInputProps): ReactElement {
    const searchInput = useRef<HTMLInputElement>(null);
    const currentValueString = currentValue && displayAttribute ? displayAttribute.get(currentValue).displayValue : undefined;

    useEffect(() => {
        if (searchInput !== null && searchInput.current !== null) {
            setRef(searchInput.current);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    return (
        <div className="srs-search-input">
            {optionTextType === "text" && (
                <Fragment>
                    {currentValue && mxFilter === "" && (
                        <span className="mx-text srs-current-value">{currentValueString}</span>
                    )}
                    <input
                    style={{caretColor: (currentValue !== undefined && mxFilter === "" ? 'transparent': "")}}
                        name={name}
                        placeholder={currentValue ? "" : placeholder}
                        type="text"
                        onChange={event => onChange(event)}
                        readOnly={isReadOnly || !isSearchable}
                        disabled={isReadOnly}
                        value={mxFilter}
                        ref={searchInput}
                        autoComplete="off"
                        onClick={(event: MouseEvent<HTMLInputElement>) => {
                            if (showMenu !== undefined && showMenu) {
                                event.stopPropagation();
                            }
                        }}
                    ></input>
                </Fragment>
            )}
            {optionTextType !== "text" && (
                <Fragment>
                    {currentValue &&
                        mxFilter === "" &&
                        displayContent(
                            currentValue,
                            optionTextType,
                            displayAttribute,
                            optionCustomContent,
                            "mx-text srs-current-value"
                        )}
                    <input
                    style={{caretColor: (currentValue !== undefined && mxFilter === "" ? 'transparent': "")}}
                        name={name}
                        placeholder={currentValue ? "" : placeholder}
                        type="text"
                        onChange={event => onChange(event)}
                        readOnly={isReadOnly || !isSearchable}
                        disabled={isReadOnly}
                        value={mxFilter}
                        ref={searchInput}
                        autoComplete="off"
                        onClick={(event: MouseEvent<HTMLInputElement>) => {
                            if (showMenu) {
                                event.stopPropagation();
                            }
                        }}
                    ></input>
                    {currentValue === undefined && !isSearchable && (
                        <span className="srs-text">{placeholder}</span>
                    )}
                </Fragment>
            )}
        </div>
    );
}
