import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {DocInfoProperty} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Strings} from "polar-shared/src/util/Strings";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";

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
        <div className={props.className}
             style={{
                 ...props.style,
             }}>

            <InputLabel shrink>{label}</InputLabel>

            <div style={{display: 'flex'}}>
                <TextareaAutosize className={props.className}
                              style={{flexGrow: 1}}
                              rowsMin={5}
                              required={! props.optional}
                              defaultValue={props.value || ''}
                              onChange={event => props.onChange(event.target.value)}/>
            </div>
            {props.description !== undefined && (
                <div>
                    <FormHelperText>{props.description}</FormHelperText>
                </div>
            )}
        </div>
    );
});
