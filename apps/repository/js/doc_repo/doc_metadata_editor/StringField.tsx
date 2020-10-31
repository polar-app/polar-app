import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {IField} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import TextField from "@material-ui/core/TextField/TextField";
import {Strings} from "polar-shared/src/util/Strings";

interface IProps extends IField {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly value: string | undefined;
    readonly onChange: (value: string) => void;
}

export const StringField = deepMemo((props: IProps) => {

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
