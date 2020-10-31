import * as React from 'react';
import {DocMetadataEditor} from "../repository/js/doc_repo/doc_metadata_editor/DocMetadataEditor";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {PagemarkType} from "polar-shared/src/metadata/PagemarkType";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const docInfo: IDocInfo = {
    title: "Zombies Invade Paris",
    fingerprint: '10101',
    progress: 0,
    pagemarkType: PagemarkType.SINGLE_COLUMN,
    properties: {},
    attachments: {},
    archived: false,
    flagged: false,
    nrPages: 1,
    authors: ['Alice Smith', 'Bob Young']
}

export const App = () => {
    return (
        <div style={{width: '600px', margin: '5px'}}>
            <DocMetadataEditor docInfo={docInfo} onUpdate={NULL_FUNCTION}/>
        </div>
    );
}