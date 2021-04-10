import * as React from 'react';
import {useDialogManager} from "../../../../../web/js/mui/dialogs/MUIDialogControllers";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {DocMetadataEditor} from "./DocMetadataEditor";
import {useDocRepoCallbacks} from "../DocRepoStore2";
import {RepoDocInfo} from "../../RepoDocInfo";
import {Analytics} from "../../../../../web/js/analytics/Analytics";

export function useDocMetadataEditor() {

    const dialogs = useDialogManager();

    const docInfoRef = React.useRef<IDocInfo | undefined>();

    const handleUpdate = React.useCallback((docInfo: IDocInfo) => {
        docInfoRef.current = docInfo
    }, []);

    return React.useCallback((docInfo: IDocInfo,
                              onUpdate: (docInfo: IDocInfo) => void) => {

        docInfoRef.current = docInfo;

        Analytics.event2('doc-metadataModalOpened');

        dialogs.dialog({
            title: "Update Document Metadata",
            body: (
                <>
                    {docInfo && (
                        <DocMetadataEditor docInfo={docInfo} onUpdate={handleUpdate}/>
                    )}
                </>
            ),
            type: 'none',
            onAccept: () => onUpdate(docInfoRef.current!),
            acceptText: "Update",
            maxWidth: "lg",
            inputCompletionType: 'meta+enter'
        });

    }, [dialogs, handleUpdate])

}

export function useDocMetadataEditorForSelected() {

    const {selectedProvider, onUpdated} = useDocRepoCallbacks();
    const docMetadataEditor = useDocMetadataEditor()

    const handleUpdated = React.useCallback((repoDocInfo: RepoDocInfo, docInfo: IDocInfo) => {
        Analytics.event2('doc-metadataUpdated');
        onUpdated(repoDocInfo, docInfo)
    }, [onUpdated]);

    return React.useCallback(() => {

        const selected = selectedProvider();

        if (selected.length === 0) {
            return;
        }

        const repoDocInfo = selected[0];

        docMetadataEditor(repoDocInfo.docInfo, (docInfo) => handleUpdated(repoDocInfo, docInfo));

    }, [docMetadataEditor, handleUpdated, selectedProvider]);

}
