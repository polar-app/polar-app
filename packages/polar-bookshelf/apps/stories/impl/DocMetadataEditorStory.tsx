import * as React from "react";
import {DocMetadataEditor} from "../../repository/js/doc_repo/doc_metadata_editor/DocMetadataEditor";
import { IDocInfo } from "polar-shared/src/metadata/IDocInfo";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { PagemarkType } from "polar-shared/src/metadata/PagemarkType";

const DOC_INFO: IDocInfo = {
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

interface IDocMetadataPreviewProps {
    readonly docInfo: IDocInfo;
}

export const DocMetadataPreview = (props: IDocMetadataPreviewProps) => {

    const json = JSON.stringify(props.docInfo, null, "  ");

    return (
        <div>
            <pre>
                {json}
            </pre>
        </div>
    );
}

export const DocMetadataEditorStory = () => {

    const [docInfo, setDocInfo] = React.useState<IDocInfo>(DOC_INFO);

    return (
        <div style={{display: 'flex'}}>

            <div style={{width: '600px', margin: '5px'}}>
                <DocMetadataEditor docInfo={docInfo} onUpdate={setDocInfo}/>
            </div>

            <DocMetadataPreview docInfo={docInfo}/>

        </div>
    )
}