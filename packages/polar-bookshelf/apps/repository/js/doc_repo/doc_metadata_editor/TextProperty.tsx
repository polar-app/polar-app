import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {DocInfoProperty} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Strings} from "polar-shared/src/util/Strings";
import TextField from "@material-ui/core/TextField";

interface IProps extends DocInfoProperty {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly value: string | undefined;
    readonly onChange: (value: string) => void;
}

export const TextProperty = deepMemo(function TextProperty(props: IProps) {

    const label = props.label || Strings.upperFirst(props.name);

    return (
        <TextField className={props.className}
                   style={props.style}
                   required={! props.optional}
                   multiline
                   rows={5}
                   rowsMax={10}
                   label={label}
                   defaultValue={props.value || ''}
                   helperText={props.description}
                   onChange={event => props.onChange(event.target.value)}/>
    );
});
