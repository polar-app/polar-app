import * as React from 'react';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import { StringField } from './StringField';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {StringArrayField} from "./StringArrayField";
import { StringArrayAutocompleteField } from './StringArrayAutocompleteField';
import {Dictionaries} from "polar-shared/src/util/Dictionaries";

export interface IField {
    readonly name: keyof IDocInfo;
    readonly label?: string;
    readonly description?: string;
    readonly optional?: true;
    readonly type: 'string' | 'string[]';
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
        name: 'volume',
        optional: true,
        type: 'string'
    },
    {
        name: 'edition',
        optional: true,
        type: 'string'
    },
    {
        name: 'issn',
        label: 'ISSN',
        optional: true,
        type: 'string'
    },
    {
        name: 'isbn',
        label: 'ISBN',
        description: 'An International Standard Book Number is a numeric commercial book identifier.',
        optional: true,
        type: 'string'
    },
    {
        name: 'doi',
        label: 'DOI',
        description: 'Document Identifier (doi)',
        optional: true,
        type: 'string'
    },
    {
        name: 'pmid',
        label: 'PMID',
        description: 'PubMed ID',
        optional: true,
        type: 'string'
    },
    {
        name: 'journal',
        optional: true,
        type: 'string'
    },
    {
        name: 'publisher',
        description: 'The publisher of this document.  Usually the name of an academic journal',
        optional: true,
        type: 'string'
    },
    {
        name: 'copyright',
        description: 'The copyright of this document.',
        optional: true,
        type: 'string'
    },
    {
        name: 'keywords',
        description: 'The keywords that are defined by the publisher for this document',
        optional: true,
        type: 'string[]'
    },
    {
        name: 'authors',
        description: 'The author or authors of this document',
        optional: true,
        type: 'string[]'
    },
    {
        name: 'editor',
        description: 'The editor or editors of this document',
        optional: true,
        type: 'string[]'
    }

    // TODO: abstract, subtitle

];

const useStyles = makeStyles((theme) =>
    createStyles({
        box: {
            display: 'flex'
        },
        field: {
            flexGrow: 1
        },
    }),
);

interface IProps {
    readonly docInfo: IDocInfo;
    readonly onUpdate: (docInfo: IDocInfo) => void;
}

export const DocMetadataEditor = deepMemo((props: IProps) => {

    const [docInfo, setDocInfo] = React.useState(props.docInfo);
    const classes = useStyles();

    const handleFieldChangeForString = React.useCallback((field: IField, value: string) => {

        const newDocInfo = Dictionaries.copyOf(props.docInfo);

        if (field.optional) {
            newDocInfo[field.name] = value.trim() === '' ? undefined : '';
        } else {
            newDocInfo[field.name] = value;
        }

        props.onUpdate(newDocInfo);

    }, [props]);

    const handleFieldChangeForStringArray = React.useCallback((field: IField, values: ReadonlyArray<string>) => {

        const newDocInfo = Dictionaries.copyOf(props.docInfo);

        if (field.optional) {
            newDocInfo[field.name] = values.length === 0 ? undefined : values;
        } else {
            newDocInfo[field.name] = values;
        }

        props.onUpdate(newDocInfo);

    }, [props]);

    const toComponent = React.useCallback((field: IField) => {

        switch (field.type) {
            case "string":
                return (
                    <StringField className={classes.field}
                                 docInfo={docInfo}
                                 value={docInfo[field.name] as string}
                                 onChange={value => handleFieldChangeForString(field, value)}
                                 {...field}/>
                );
            case "string[]":
                // return (
                //     <StringArrayField className={classes.field}
                //                       docInfo={docInfo}
                //                       values={docInfo[field.name] as string[]}
                //                       onUpdate={setDocInfo}
                //                       {...field}/>
                // );

                return (
                    <StringArrayAutocompleteField className={classes.field}
                                                  docInfo={docInfo}
                                                  values={docInfo[field.name] as string[]}
                                                  onChange={values => handleFieldChangeForStringArray(field, values)}
                                                  {...field}/>
                );



            default:
                return null;
        }

    }, [classes.field, docInfo, handleFieldChangeForString, handleFieldChangeForStringArray]);

    return (
        <div>
            {FIELDS.map(current => (
                <Box key={current.name}
                     className={classes.box}
                     mt={1}>
                    {toComponent(current)}
                </Box>
            ))}
        </div>
    );

});