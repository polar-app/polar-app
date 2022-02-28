import React from 'react';
import {DocImporter, ImportedFile} from "../importers/DocImporter";
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {useDocLoader} from "../../main/DocLoaderHooks";
import IconButton from '@material-ui/core/IconButton';
import {BackendFileRefs} from "../../../datastore/BackendFileRefs";
import {Either} from "../../../util/Either";
import LaunchIcon from '@material-ui/icons/Launch';
import {Strings} from "polar-shared/src/util/Strings";
import {useAccountVerifiedAction} from "../../../../../apps/repository/js/ui/useAccountVerifiedAction";
import {LoadDocRequest} from "../../main/doc_loaders/LoadDocRequest";
import {IUpload} from "./IUpload";
import {Tags} from "polar-shared/src/tags/Tags";
import {UploadFilters} from "./UploadFilters";
import {UploadHandler, useBatchUploader} from "./UploadHandlers";
import {useAnalytics} from "../../../analytics/Analytics";
import {useDocumentBlockFromDocInfoCreator} from "../../../notes/NoteUtils";
import {useErrorHandler} from "../../../mui/useErrorHandler";

export namespace AddFileHooks {

    export function useAddFileImporter() {

        const errorHandler = useErrorHandler();
        const {persistenceLayerProvider} = usePersistenceLayerContext()
        const dialogManager = useDialogManager();
        const docLoader = useDocLoader();
        const accountVerifiedAction = useAccountVerifiedAction()
        const batchUploader = useBatchUploader();
        const analytics = useAnalytics();
        const createDocumentBlockFromDocInfo = useDocumentBlockFromDocInfoCreator();

        const handleUploads = React.useCallback(async (uploads: ReadonlyArray<IUpload>): Promise<ReadonlyArray<ImportedFile>> => {

            function toUploadHandler(upload: IUpload): UploadHandler<ImportedFile> {

                return async (uploadProgress, onController): Promise<ImportedFile> => {

                    console.log("uploading file: ", upload.name);

                    const blob = await upload.blob();

                    const docInfo = {
                        tags: upload.tags ? Tags.toMap(upload.tags) : undefined,
                        bytes: blob.size
                    };

                    if (! docInfo.tags) {
                        delete docInfo.tags;
                    }

                    const importedFile = await DocImporter.importFile(persistenceLayerProvider,
                                                                      URL.createObjectURL(blob),
                                                                      FilePaths.basename(upload.name),
                                                                      {progressListener: uploadProgress, docInfo, onController});


                    createDocumentBlockFromDocInfo(importedFile.docInfo);


                    console.log("Imported file: ", importedFile);

                    return importedFile;

                }

            }


            const uploadHandlers = uploads.map(toUploadHandler);

            return await batchUploader(uploadHandlers);

        }, [batchUploader, persistenceLayerProvider, createDocumentBlockFromDocInfo]);

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
                        // first, import all the files...
                        const importedFiles = await handleUploads(uploads);

                        // now, prompt to open them...
                        promptToOpenFiles(importedFiles);

                        analytics.event2('add-file-import-succeeded', {count: uploads.length});

                    } catch (e) {
                        analytics.event2('add-file-import-failed', {count: uploads.length});
                        errorHandler("Unable to upload files: " + (e as any).message, uploads, e);
                    }

                }

                accountVerifiedAction(() => {
                    doAsync().catch(err => errorHandler(err));
                });

            } else {
                throw new Error("Unable to upload files.  Only PDF and EPUB uploads are supported.");
            }

        }, [accountVerifiedAction, analytics, errorHandler, handleUploads, promptToOpenFiles]);

        // TODO: to many dependencies here and I'm going to need to clean tyhis up.
        return React.useCallback((uploads: ReadonlyArray<IUpload>) => {

            if (! uploads || uploads.length === 0) {
                console.warn("No dataTransfer files");
                return;
            }

            doDirectUpload(uploads.filter(UploadFilters.filterByDocumentName))
                .catch(err => errorHandler("Unable to handle upload: ", err));

        }, [errorHandler, doDirectUpload]);

    }

}
