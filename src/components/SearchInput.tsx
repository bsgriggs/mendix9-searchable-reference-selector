import { ChangeEvent, createElement, Fragment, ReactElement, useEffect, useRef } from "react";
import displayContent from "src/utils/displayContent";
import { OptionTextTypeEnum } from "typings/SearchableReferenceSelectorMxNineProps";
import {ObjectItem, ListAttributeValue, ListWidgetValue} from "mendix";

interface SearchInputProps{
    name: string | undefined;
    optionTextType: OptionTextTypeEnum;
    placeholder: string|undefined;
    mxFilter: string;
    onChange: (event: ChangeEvent<HTMLInputElement>)=>void
    isReadOnly: boolean;
    isSearchable: boolean;
    currentValue: ObjectItem | undefined;
    displayAttribute: ListAttributeValue<string>;
    optionCustomContent: ListWidgetValue |undefined;
    setRef: (newRef: HTMLInputElement)=>void;
    showMenu?: boolean;
}

export default function SearchInput({name, optionTextType, placeholder, onChange, isReadOnly, mxFilter, currentValue, isSearchable, displayAttribute, showMenu, optionCustomContent, setRef}: SearchInputProps): ReactElement {
    const searchInput = useRef<HTMLInputElement>(null);
    useEffect(()=>{
        if(searchInput !== null && searchInput.current !== null){
            setRef(searchInput.current);
        }
    }, [searchInput])
    return (
        <Fragment>
            {optionTextType === "text" && (
                <input
                    name={name}
                    placeholder={placeholder}
                    type="text"
                    onChange={(event) => onChange(event)}
                    readOnly={isReadOnly || currentValue !== undefined || !isSearchable}
                    disabled={isReadOnly}
                    value={
                        currentValue !== undefined && displayAttribute !== undefined
                            ? displayAttribute.get(currentValue).displayValue
                            : mxFilter
                    }
                    ref={searchInput}
                    autoComplete="off"
                    onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                        if (showMenu !== undefined && showMenu) {
                            event.stopPropagation();
                        }
                    }}
                ></input>
            )}
            {optionTextType !== "text" && (
                <Fragment>
                    {currentValue === undefined && isReadOnly === false && isSearchable && (
                        <input
                            name={name}
                            placeholder={placeholder}
                            type="text"
                            onChange={(event) => onChange(event)}
                            readOnly={isReadOnly || currentValue !== undefined || !isSearchable}
                            disabled={isReadOnly}
                            value={mxFilter}
                            ref={searchInput}
                            autoComplete="off"
                            onClick={(event: React.MouseEvent<HTMLInputElement>) => {
                                if (showMenu) {
                                    event.stopPropagation();
                                }
                            }}
                        ></input>
                    )}
                    {currentValue === undefined && isSearchable === false && (
                        <span className="srs-text">{placeholder}</span>
                    )}
                    {currentValue !== undefined &&
                        displayContent(currentValue, optionTextType, displayAttribute, optionCustomContent, "srs-text")}
                </Fragment>
            )}
        </Fragment>
    );
}
