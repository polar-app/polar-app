import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import TitleIcon from '@material-ui/icons/Title';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Divider from "@material-ui/core/Divider";
import FlagIcon from "@material-ui/icons/Flag";
import ArchiveIcon from "@material-ui/icons/Archive";
import {LocalStorageFeatureToggles} from "polar-shared/src/util/LocalStorageFeatureToggles";
import {useDocRepoCallbacks} from "./DocRepoStore2";
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {Arrays} from "polar-shared/src/util/Arrays";
import {usePersistenceContext} from "../persistence_layer/PersistenceLayerApp";
import {Backend} from "polar-shared/src/datastore/Backend";
import {BackendFileRefs} from "../../../../web/js/datastore/BackendFileRefs";
import {Either} from "polar-shared/src/util/Either";
import {FileSavers} from "polar-file-saver/src/FileSavers";
import {useDialogManager} from "../../../../web/js/mui/dialogs/MUIDialogControllers";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useLogger} from "../../../../web/js/mui/MUILogger";
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import {FADatabaseIcon} from "../../../../web/js/mui/MUIFontAwesome";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import BallotIcon from '@material-ui/icons/Ballot';
import {useDocMetadataEditorForSelected} from "./doc_metadata_editor/DocMetadataEditorHook";
import LaunchIcon from '@material-ui/icons/Launch';
import {FeatureToggleEnabled} from '../persistence_layer/PrefsContext2';
import AddIcon from '@material-ui/icons/Add';
import {JSONRPC} from "../../../../web/js/datastore/sharing/rpc/JSONRPC";
import {DeviceRouter} from "../../../../web/js/ui/DeviceRouter";

// NOTE that this CAN NOT be a functional component as it breaks MUI menu
// component.

interface IProps {

}

interface ErrorDialogOpts {
    readonly title: string;
    readonly subtitle: string;
}

function useErrorDialog() {

    const dialogs = useDialogManager();

    return React.useCallback((opts: ErrorDialogOpts) => {
        dialogs.confirm({
            ...opts,
            noCancel: true,
            type: 'error',
            onAccept: NULL_FUNCTION
        });

    }, [dialogs]);

}

export interface IDocumentDownloadURL {
    readonly name: string;
    readonly url: string;
    readonly docID: string;
}

export function useDocumentDownloadURLCalculator() {

    const {selectedProvider} = useDocRepoCallbacks();
    const {persistenceLayerProvider} = usePersistenceContext();
    const errorDialog = useErrorDialog();

    return React.useCallback((): IDocumentDownloadURL | undefined => {

        const selected = selectedProvider();
        const repoDocInfo = Arrays.first(selected);

        if (!repoDocInfo) {

            // no selected doc
            errorDialog({
                title: "No document selected",
                subtitle: "There is no document selected to download.",
            });

            return undefined;

        }

        const persistenceLayer = persistenceLayerProvider();

        const fileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(repoDocInfo.docInfo));

        if (!fileRef) {

            errorDialog({
                title: "No document attached to file.",
                subtitle: "The document you're trying to save doesn't have an attachment (EPUB or PDF).",
            });

            return undefined;

        }

        const {url} = persistenceLayer.getFile(Backend.STASH, fileRef);

        return {url, name: fileRef.name, docID: repoDocInfo.fingerprint};

    }, [selectedProvider, errorDialog, persistenceLayerProvider]);

}

export function useDocumentDownloadHandler() {

    const documentDownloadURLCalculator = useDocumentDownloadURLCalculator();

    return React.useCallback(() => {

        const download = documentDownloadURLCalculator();

        if (download) {

            const {url, name} = download;

            FileSavers.saveAs(url, name);

        }

    }, [documentDownloadURLCalculator]);

}

export function useJSONDownloadHandler() {

    const {selectedProvider} = useDocRepoCallbacks();
    const {persistenceLayerProvider} = usePersistenceContext();
    const errorDialog = useErrorDialog();
    const log = useLogger();

    return React.useCallback(() => {

        async function doAsync() {

            const selected = selectedProvider();
            const repoDocInfo = Arrays.first(selected);

            if (repoDocInfo) {

                const persistenceLayer = persistenceLayerProvider();
                const docMeta = await persistenceLayer.getDocMeta(repoDocInfo.docInfo.fingerprint);

                if (! docMeta) {

                    errorDialog({
                        title: "No document metadata for document",
                        subtitle: "Could not find any document metadata for document."
                    });

                    return;

                }

                const json = JSON.stringify(docMeta, null, "  ");

                const blob = new Blob([json], {type: "text/json"});
                FileSavers.saveAs(blob, repoDocInfo.docInfo.fingerprint + ".json");

            }

        }

        doAsync().catch(err => log.error(err));

    }, [selectedProvider, errorDialog, persistenceLayerProvider, log]);

}

const UpdateDocMetadataMenuItem = deepMemo(function UpdateDocMetadataMenuItem() {

    const docMetadataEditorForSelected = useDocMetadataEditorForSelected()

    return (
        <MenuItem onClick={docMetadataEditorForSelected}>
            <ListItemIcon>
                <BallotIcon fontSize="small"/>
            </ListItemIcon>
            <ListItemText primary="Update Metadata"/>
        </MenuItem>
    );

});

function useIndexForAIHandler() {

    const documentDownloadURLCalculator = useDocumentDownloadURLCalculator();
    const errorDialog = useErrorDialog();
    const dialogManager = useDialogManager();

    return React.useCallback(() => {

        const download = documentDownloadURLCalculator();;

        if (download) {

            const {url, docID} = download;

            if (! url.toLowerCase().endsWith('.pdf')) {

                errorDialog({
                    title: "Only PDF documents supported",
                    subtitle: "Skipping document  as we currently only support PDF documents: "
                });

                return;

            }

            async function doAsync() {

                // NOTE that the AnswerIndexer doesn't trigger a background job
                // and will wait until complete so we have to send the message
                // first.
                dialogManager.snackbar({
                    message: "Indexing document for AI.  This might take a few minutes."
                })

                await JSONRPC.exec("AnswerIndexer", {url, docID})

            }

            doAsync()
                .catch(err => console.error("Could not index document for AI: " + url, err));

        }

    }, [documentDownloadURLCalculator, errorDialog, dialogManager]);

}

export const MUIDocDropdownMenuItems = React.memo(function MUIDocDropdownMenuItems() {

    const callbacks = useDocRepoCallbacks();

    const selected = callbacks.selectedProvider();

    const documentDownloadHandler = useDocumentDownloadHandler();
    const jsonDownloadHandler = useJSONDownloadHandler();

    const indexForAIHandler = useIndexForAIHandler();

    // if (selected.length === 0) {
    //     // there's nothing to render now...
    //     return null;
    // }

    const isSingle = selected.length === 1;

    const single = selected.length === 1 ? selected[0] : undefined;

    return (
        <>
            {isSingle &&
                <MenuItem onClick={callbacks.onOpen}>
                    <ListItemIcon>
                        <LaunchIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Open Document"/>
                </MenuItem>}

            {isSingle &&
                <FeatureToggleEnabled featureName='answers'>
                    <MenuItem onClick={indexForAIHandler}>
                        <ListItemIcon>
                            <AddIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Index for AI"/>
                    </MenuItem>
                </FeatureToggleEnabled>}

            <MenuItem onClick={callbacks.onTagged}>
                <ListItemIcon>
                    <LocalOfferIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Tag"/>
            </MenuItem>

            {isSingle &&
                <MenuItem onClick={callbacks.onRename}>
                    <ListItemIcon>
                        <TitleIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Rename"/>
                </MenuItem>}

            <MenuItem onClick={callbacks.onFlagged}>
                <ListItemIcon>
                    <FlagIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Flag"/>
            </MenuItem>

            <MenuItem onClick={callbacks.onArchived}>
                <ListItemIcon>
                    <ArchiveIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Archive"/>
            </MenuItem>

            {isSingle &&
                <UpdateDocMetadataMenuItem/>}

            {single && single.url &&
                <MenuItem onClick={callbacks.onCopyOriginalURL}>
                    <ListItemIcon>
                        <FileCopyIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Copy Original URL"/>
                </MenuItem>}

            {isSingle && LocalStorageFeatureToggles.get('dev') &&
                <MenuItem onClick={callbacks.onCopyDocumentID}>
                    <ListItemIcon>
                        <FileCopyIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Copy Document ID"/>
                </MenuItem>}

            <Divider/>

            <DeviceRouter.Desktop>
                <>
                    <MenuItem onClick={documentDownloadHandler}>
                        <ListItemIcon>
                            <SaveAltIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Download Document"/>
                    </MenuItem>

                    <MenuItem onClick={jsonDownloadHandler}>
                        <ListItemIcon>
                            <FADatabaseIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText primary="Download Document Metadata"/>
                    </MenuItem>

                    <Divider/>

                </>

            </DeviceRouter.Desktop>

            <MenuItem onClick={callbacks.onDeleted}>
                <ListItemIcon>
                    <DeleteIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText primary="Delete"/>
            </MenuItem>
        </>
    );
});
