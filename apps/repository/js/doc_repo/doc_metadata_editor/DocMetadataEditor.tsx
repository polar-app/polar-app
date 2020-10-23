import * as React from 'react';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import TextField from '@material-ui/core/TextField/TextField';
import { Dictionaries } from 'polar-shared/src/util/Dictionaries';

interface IField {
    readonly name: keyof IDocInfo;
    readonly description?: string;
    readonly optional?: true;
    readonly type: 'string';
}

// TODO: we will need to special handle arrays with a component that can work
// with an array of strings.

// TODO: move over every field from IDocBib.

const FIELDS: ReadonlyArray<IField> = [
    {
        name: 'title',
        optional: true,
        type: 'string'
    },
    {
        name: 'description',
        description: "A short description for the document",
        optional: true,
        type: 'string'
    },
    {
        name: 'doi',
        description: 'Document Identifier (doi)',
        optional: true,
        type: 'string'
    }


];

interface StringFieldProps extends IField {
    readonly docInfo: IDocInfo;
    readonly value: string | undefined;
    readonly onUpdate: (docInfo: IDocInfo) => void;
}

const StringField = deepMemo((props: StringFieldProps) => {

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

interface IProps {
    readonly docInfo: IDocInfo;
}

export const DocMetadataEditor = deepMemo((props: IProps) => {

    const [docInfo, setDocInfo] = React.useState(props.docInfo);

    const toComponent = React.useCallback((field: IField) => {

        switch (field.type) {
            case "string":
                return (
                    <StringField key={field.name}
                                 docInfo={docInfo}
                                 value={docInfo[field.name] as string}
                                 onUpdate={setDocInfo}
                                 {...field}/>
                );
            default:
                return null;
        }

    }, [docInfo]);

    return (
        <>
            {FIELDS.map(toComponent)}
        </>
    );

});