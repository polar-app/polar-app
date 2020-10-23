import * as React from "react";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import {IField} from "./DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import TextField from "@material-ui/core/TextField/TextField";

interface IProps extends IField {
    readonly docInfo: IDocInfo;
    readonly value: string | undefined;
    readonly onUpdate: (docInfo: IDocInfo) => void;
}

export const StringField = deepMemo((props: IProps) => {

    const handleUpdate = React.useCallback((value: string) => {

        const newDocInfo = Dictionaries.copyOf(props.docInfo);

        if (props.optional) {
            newDocInfo[props.name] = value.trim() === '' ? undefined : '';
        } else {
            newDocInfo[props.name] = value;
        }

        props.onUpdate(newDocInfo);

    }, [props]);

    return (
        <div>
            <TextField required
                       label={props.name}
                       defaultValue={props.value || ''}
                       onChange={event => handleUpdate(event.target.value)}/>
        </div>
    );
});
