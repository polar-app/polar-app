import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {DocInfoProperty} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import TextField from "@material-ui/core/TextField/TextField";
import {Strings} from "polar-shared/src/util/Strings";

interface IProps extends DocInfoProperty {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly value: string | undefined;
    readonly onChange: (value: string) => void;
}

export const StringProperty = deepMemo(function StringProperty(props: IProps) {

    const label = props.label || Strings.upperFirst(props.name);

    return (
        <TextField className={props.className}
                   style={props.style}
                   required={! props.optional}
                   label={label}
                   defaultValue={props.value || ''}
                   helperText={props.description}
                   onChange={event => props.onChange(event.target.value)}/>
    );
});
