import * as React from 'react';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";

export interface IField {
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