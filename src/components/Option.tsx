import React, { createElement } from "react";

type OptionProps = {
    key: React.Key;
    text?: string
    isSelected: boolean;
    onSelect: () => void;
};

const Option = ({ key, text, isSelected, onSelect }: OptionProps) => {
    return (
        <button key={key} className={isSelected ? ".selected" : ""} onClick={onSelect}>
            {text ? text : <React.Fragment>&nbsp;</React.Fragment>}
        </button>
    );
};

export default Option;
