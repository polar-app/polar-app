import React from 'react';
import {DocImporter, ImportedFile} from "../importers/DocImporter";
import {useLogger} from "../../../mui/MUILogger";
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {DeterminateProgressBar} from "../../../ui/progress_bar/DeterminateProgressBar";
import {ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {WriteFileProgressListener} from "../../../datastore/Datastore";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {useDocLoader} from "../../main/DocLoaderHooks";
import IconButton from '@material-ui/core/IconButton';
import {BackendFileRefs} from "../../../datastore/BackendFileRefs";
import {Either} from "../../../util/Either";
import LaunchIcon from '@material-ui/icons/Launch';
import {Strings} from "polar-shared/src/util/Strings";
import {AccountVerifiedAction} from "../../../../../apps/repository/js/ui/AccountVerifiedAction";
import {LoadDocRequest} from "../../main/doc_loaders/LoadDocRequest";
import {IUpload} from "./IUpload";
import {Tags} from "polar-shared/src/tags/Tags";
import {DiskDatastoreMigrations, useDiskDatastoreMigration} from "./DiskDatastoreMigrations";
import {useBatchProgressTaskbar, useUploadProgressTaskbar} from "./UploadProgressTaskbar";
import {UploadFilters} from "./UploadFilters";
import {UploadHandler, useBatchUploader} from "./UploadHandlers";
import {useAnalytics} from "../../../analytics/Analytics";

export namespace AddFileHooks {

    import useAccountVerifiedAction = AccountVerifiedAction.useAccountVerifiedAction;

    export function useAddFileImporter() {

        const log = useLogger();
        const {persistenceLayerProvider} = usePersistenceLayerContext()
        const dialogManager = useDialogManager();
        const docLoader = useDocLoader();
        const accountVerifiedAction = useAccountVerifiedAction()
        const diskDatastoreMigration = useDiskDatastoreMigration();
        const batchUploader = useBatchUploader();
        const analytics = useAnalytics();

        const handleUploads = React.useCallback(async (uploads: ReadonlyArray<IUpload>): Promise<ReadonlyArray<ImportedFile>> => {

            function toUploadHandler(upload: IUpload): UploadHandler<ImportedFile> {

                return async (uploadProgress, onController): Promise<ImportedFile> => {

                    console.log("uploading file: ", upload.name);

                    const blob = await upload.blob();

                    const docInfo = {
                        tags: upload.tags ? Tags.toMap(upload.tags) : undefined,
                        bytes: blob.size
                    }

                    const importedFile = await DocImporter.importFile(persistenceLayerProvider,
                                                                      URL.createObjectURL(blob),
                                                                      FilePaths.basename(upload.name),
                                                                      {progressListener: uploadProgress, docInfo, onController});

                    console.log("Imported file: ", importedFile);

                    return importedFile;

                }

            }


            const uploadHandlers = uploads.map(toUploadHandler);

            return await batchUploader(uploadHandlers);

        }, [batchUploader, persistenceLayerProvider]);

        const promptToOpenFiles = React.useCallback((importedFiles: ReadonlyArray<ImportedFile>) => {

            function createSnackbar(importedFile: ImportedFile) {

                const title = Strings.truncate(importedFile.docInfo.title || 'Untitled', 20);
                const {docInfo} = importedFile;

                function doOpenDoc() {

                    const backendFileRef = BackendFileRefs.toBackendFileRef(Either.ofRight(docInfo))!;

                    const docLoadRequest: LoadDocRequest = {
                        fingerprint: docInfo.fingerprint,
                        title,
                        url: docInfo.url,
                        backendFileRef,
                        newWindow: true
                    };

                    docLoader(docLoadRequest)
                }

                const Action = () => (
                    <IconButton size="small"
                                color="secondary"
                                onClick={doOpenDoc}>
                        <LaunchIcon/>
                    </IconButton>
                );

                dialogManager.snackbar({
                    message: `Would you like to open '${title}' now?`,
                    type: 'success',
                    action: <Action/>
                });

            }

            if (importedFiles.length === 1) {
                const importedFile = importedFiles[0];
                createSnackbar(importedFile);
            }

        }, [dialogManager, docLoader]);

        const doDirectUpload = React.useCallback(async (uploads: ReadonlyArray<IUpload>) => {

            if (uploads.length > 0) {

                async function doAsync() {

                    try {
                        const importedFiles = await handleUploads(uploads);
                        promptToOpenFiles(importedFiles);

                        analytics.event2('add-file-import-succeeded', {count: uploads.length});

                    } catch (e) {
                        analytics.event2('add-file-import-failed', {count: uploads.length});
                        log.error("Unable to upload files: " + e.message, uploads, e);
                    }

                }

                accountVerifiedAction(() => {
                    doAsync().catch(err => log.error(err));
                });

            } else {
                throw new Error("Unable to upload files.  Only PDF and EPUB uploads are supported.");
            }

        }, [accountVerifiedAction, analytics, handleUploads, log, promptToOpenFiles]);

        // TODO: to many dependencies here and I'm going to need to clean tyhis up.
        return React.useCallback((uploads: ReadonlyArray<IUpload>) => {

            if (! uploads || uploads.length === 0) {
                log.warn("No dataTransfer files");
                return;
            }

            const migration = DiskDatastoreMigrations.prepare(uploads);

            if (migration.required) {
                diskDatastoreMigration(migration);
            } else {
                doDirectUpload(uploads.filter(UploadFilters.filterByDocumentName))
                    .catch(err => log.error("Unable to handle upload: ", err));
            }

        }, [log, diskDatastoreMigration, doDirectUpload]);

    }

}
