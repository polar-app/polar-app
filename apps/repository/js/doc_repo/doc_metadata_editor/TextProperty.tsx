import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {DocInfoProperty} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Strings} from "polar-shared/src/util/Strings";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

interface IProps extends DocInfoProperty {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly docInfo: IDocInfo;
    readonly value: string | undefined;
    readonly onChange: (value: string) => void;
}

export const TextProperty = deepMemo((props: IProps) => {

    const label = props.label || Strings.upperFirst(props.name);

    return (
        <TextareaAutosize className={props.className}
                          style={props.style}
                          rowsMin={3}
                          rowsMax={10}
                          required={! props.optional}
                          defaultValue={props.value || ''}
                          onChange={event => props.onChange(event.target.value)}/>
    );
});
