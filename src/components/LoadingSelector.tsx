import { createElement } from "react";
import { ObjectItem } from "mendix";
import Select from "react-select";

interface LoadingSelectorProps {
    name: string;
    placeholder?: string;
    tabIndex?: number;
}

const LoadingSelector = (props: LoadingSelectorProps): JSX.Element => {
    return (
        <Select<ObjectItem>
            name={props.name}
            tabIndex={props.tabIndex}
            value={[]}
            isLoading={true}
            placeholder={props.placeholder}
        />
    );
};

export default LoadingSelector;
