import {
    createElement,
    CSSProperties,
    Fragment,
    ReactElement,
    useEffect,
    useRef,
    useState,
    MouseEvent,
    useMemo,
    useCallback,
    KeyboardEvent
} from "react";
import Option from "./Option";
import { focusModeEnum } from "typings/general";
import {
    OptionsStyleSetEnum,
    OptionsStyleSingleEnum,
    SelectStyleEnum
} from "typings/SearchableReferenceSelectorMxNineProps";
import { IOption } from "typings/option";
import classNames from "classnames";

interface OptionMenuProps {
    id: string;
    options: IOption[];
    focusedObjIndex: number;
    setFocusedObjIndex: (newFocus: number) => void;
    onSelect: (selectedOption: IOption) => void;
    onSelectMoreOptions: (() => void) | undefined;
    noResultsText: string;
    maxMenuHeight: string | undefined;
    moreResultsText: string | undefined;
    optionsStyle: OptionsStyleSetEnum | OptionsStyleSingleEnum;
    selectStyle: SelectStyleEnum;
    position?: DOMRect;
    hasMoreOptions: boolean;
    isLoading: boolean;
    allowLoadingSelect: boolean;
    loadingText: string;
    multiSelect: boolean;
    mxFilter: string;
    tabIndex: number;
    ariaSearchText: string | undefined;
}

const OptionsMenu = (props: OptionMenuProps): ReactElement => {
    const selectedObjRef = useRef<HTMLLIElement>(null);
    const [focusMode, setFocusMode] = useState<focusModeEnum>(
        props.focusedObjIndex !== undefined ? focusModeEnum.arrow : focusModeEnum.hover
    );

    const contentCloseToBottom = useMemo(
        () => (props.position ? props.position.y > window.innerHeight * 0.7 : 0),
        [props.position]
    );

    const OptionMenuStyle = useMemo(
        (): CSSProperties =>
            props.selectStyle === "dropdown" && props.position !== undefined
                ? {
                      maxHeight: props.maxMenuHeight ? props.maxMenuHeight : undefined,
                      top: contentCloseToBottom ? "unset" : props.position.height + props.position.y,
                      bottom: contentCloseToBottom ? window.innerHeight - props.position.y : "unset",
                      width: props.position.width,
                      left: props.position.x
                  }
                : {
                      maxHeight: props.maxMenuHeight ? props.maxMenuHeight : undefined
                  },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.position, props.maxMenuHeight]
    );

    // keep the selected item in view when using arrow keys
    useEffect(() => {
        if (selectedObjRef.current) {
            selectedObjRef.current.scrollIntoView({ block: "center" });
        }
        setFocusMode(focusModeEnum.arrow);
    }, [props.focusedObjIndex]);

    const handleKeyNavigation = useCallback(
        (event: KeyboardEvent<HTMLUListElement>): void => {
            const keyPressed = event.key;
            if (keyPressed === "ArrowUp") {
                event.preventDefault();
                if (props.focusedObjIndex === -1) {
                    props.setFocusedObjIndex(0);
                } else if (props.focusedObjIndex > 0) {
                    props.setFocusedObjIndex(props.focusedObjIndex - 1);
                } else if (props.hasMoreOptions) {
                    props.setFocusedObjIndex(props.options.length);
                } else {
                    props.setFocusedObjIndex(props.options.length - 1);
                }
            } else if (keyPressed === "ArrowDown") {
                event.preventDefault();
                if (props.focusedObjIndex === -1) {
                    props.setFocusedObjIndex(0);
                } else if (
                    props.focusedObjIndex < props.options.length - 1 ||
                    (props.focusedObjIndex === props.options.length - 1 && props.hasMoreOptions)
                ) {
                    props.setFocusedObjIndex(props.focusedObjIndex + 1);
                } else {
                    props.setFocusedObjIndex(0);
                }
            } else if (keyPressed === "Enter" || " ") {
                event.preventDefault();
                if (props.focusedObjIndex > -1 && (props.allowLoadingSelect || !props.isLoading)) {
                    if (props.focusedObjIndex === props.options.length && props.onSelectMoreOptions) {
                        props.onSelectMoreOptions();
                    } else {
                        const selectOption = props.options[props.focusedObjIndex];
                        if (selectOption.isSelectable) {
                            props.onSelect(selectOption);
                        }
                    }
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [props.focusedObjIndex, props.onSelect, props.onSelectMoreOptions, props.hasMoreOptions, props.isLoading]
    );

    return (
        <div
            className={classNames(
                "srs-menu",
                { "srs-dropdown": props.selectStyle === "dropdown" },
                { "srs-list": props.selectStyle === "list" },
                { wait: props.isLoading && !props.allowLoadingSelect }
            )}
            style={OptionMenuStyle}
            onMouseMove={() => setFocusMode(focusModeEnum.hover)}
        >
            {props.isLoading && (
                <span className="mx-text srs-infooption" role="option">
                    {props.loadingText}
                </span>
            )}
            <ul
                id={props.id + "-listbox"}
                tabIndex={props.tabIndex}
                role="listbox"
                aria-labelledby={props.id + "-label"}
                aria-activedescendant={
                    props.options.length > 0
                        ? `${props.id}-${props.focusedObjIndex === -1 ? 0 : props.focusedObjIndex}`
                        : ""
                }
                aria-multiselectable={props.multiSelect ? "true" : "false"}
                aria-busy={props.isLoading ? "true" : "false"}
                onKeyDown={handleKeyNavigation}
            >
                {props.options.length > 0 && (
                    <Fragment>
                        {props.options.map((option, key) => (
                            <li
                                id={`${props.id}-${key}`}
                                key={key}
                                ref={key === props.focusedObjIndex ? selectedObjRef : undefined}
                                role="option"
                                aria-selected={option.isSelected ? "true" : "false"}
                                aria-label={option.ariaLiveText}
                                aria-disabled={!option.isSelectable}
                            >
                                <Option
                                    isFocused={key === props.focusedObjIndex}
                                    onSelect={selectedOption => {
                                        if (props.allowLoadingSelect || !props.isLoading) {
                                            props.onSelect(selectedOption);
                                        }
                                    }}
                                    focusMode={focusMode}
                                    optionsStyle={props.optionsStyle}
                                    option={option}
                                />
                            </li>
                        ))}
                        {props.hasMoreOptions && (
                            <li
                                id={`${props.id}-${props.options.length}`}
                                key={props.options.length}
                                ref={props.focusedObjIndex === props.options.length ? selectedObjRef : undefined}
                                role="option"
                                aria-selected={props.isLoading ? undefined : "true"}
                            >
                                <div
                                    className={
                                        props.focusedObjIndex === props.options.length
                                            ? "srs-option focused"
                                            : "mx-text srs-infooption"
                                    }
                                    style={{ cursor: props.onSelectMoreOptions ? "pointer" : "default" }}
                                    onClick={(event: MouseEvent<HTMLDivElement>) => {
                                        if (
                                            (props.allowLoadingSelect || !props.isLoading) &&
                                            props.onSelectMoreOptions !== undefined
                                        ) {
                                            event.stopPropagation();
                                            props.onSelectMoreOptions();
                                        }
                                    }}
                                >
                                    {props.isLoading ? props.loadingText : props.moreResultsText}
                                </div>
                            </li>
                        )}
                    </Fragment>
                )}
            </ul>
            {props.options.length === 0 && !props.isLoading && (
                <span
                    id={`${props.id}-no-results-region`}
                    className="mx-text srs-infooption"
                    aria-live="polite"
                    role="region"
                >
                    {props.noResultsText}
                    {props.mxFilter.trim() !== "" && (
                        <span className="srs-aria-live">{`, ${props.ariaSearchText}:`}</span>
                    )}
                </span>
            )}
        </div>
    );
};

export default OptionsMenu;
