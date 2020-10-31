import * as React from 'react';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {deepMemo} from "../../../../../web/js/react/ReactUtils";
import { StringField } from './StringField';
import Box from '@material-ui/core/Box';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import {StringArrayField} from "./StringArrayField";

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
        name: 'authors',
        description: 'The author or authors of this document',
        optional: true,
        type: 'string[]'
    }

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
}

export const DocMetadataEditor = deepMemo((props: IProps) => {

    const [docInfo, setDocInfo] = React.useState(props.docInfo);
    const classes = useStyles();

    const toComponent = React.useCallback((field: IField) => {

        switch (field.type) {
            case "string":
                return (
                    <StringField className={classes.field}
                                 docInfo={docInfo}
                                 value={docInfo[field.name] as string}
                                 onUpdate={setDocInfo}
                                 {...field}/>
                );
            case "string[]":
                return (
                    <StringArrayField className={classes.field}
                                      docInfo={docInfo}
                                      values={docInfo[field.name] as string[]}
                                      onUpdate={setDocInfo}
                                      {...field}/>
                );
            default:
                return null;
        }

    }, [classes.field, docInfo]);

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