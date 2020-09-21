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
import {AddContentButtons} from "../../../../../apps/repository/js/ui/AddContentButtons";
import {LoadDocRequest} from "../../main/doc_loaders/LoadDocRequest";
import {IUpload} from "./IUpload";
import {Tags} from "polar-shared/src/tags/Tags";

export namespace AddFileHooks {

    import useAccountVerifiedAction = AddContentButtons.useAccountVerifiedAction;

    export function useAddFileImporter() {

        const log = useLogger();
        const {persistenceLayerProvider} = usePersistenceLayerContext()
        const dialogManager = useDialogManager();
        const docLoader = useDocLoader();
        const accountVerifiedAction = useAccountVerifiedAction()

        async function handleUploads(uploads: ReadonlyArray<IUpload>): Promise<ReadonlyArray<ImportedFile>> {

            async function doUpload(idx: number, upload: IUpload) {

                console.log("Importing file: ", upload.name);

                const updateProgress =
                    await dialogManager.taskbar({message: `Uploading ${idx} of ${uploads.length} file(s)`});

                updateProgress({value: 'indeterminate'});

                try {

                    const progressListener: WriteFileProgressListener = (progress) => {

                        switch (progress.type) {
                            case 'determinate':
                                updateProgress({value: progress.value});
                                break;
                            case 'indeterminate':
                                updateProgress({value: 'indeterminate'});
                                break;
                        }

                    };

                    const docInfo = {
                        tags: upload.tags ? Tags.toMap(upload.tags) : undefined
                    }

                    const importedFile = await DocImporter.importFile(persistenceLayerProvider,
                                                                      URL.createObjectURL(upload.blob),
                                                                      FilePaths.basename(upload.name),
                                                                      {progressListener, docInfo});

                    log.info("Imported file: ", importedFile);

                    result.push(importedFile);

                } catch (e) {
                    log.error("Failed to import file: ", e, upload);
                } finally {

                    updateProgress({value: 100});

                    const progress = progressTracker.terminate();
                    // TODO this should be deprecated...
                    DeterminateProgressBar.update(progress);

                }

            }

            const progressTracker = new ProgressTracker({total: uploads.length, id: 'import-files'});

            const result: ImportedFile[] = [];

            try {

                let idx = 0;

                for (const upload of uploads) {
                    ++idx;
                    await doUpload(idx, upload);
                }

                return result;

            } finally {
                // noop
            }

        }

        function promptToOpenFiles(importedFiles: ReadonlyArray<ImportedFile>) {

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

        }

        async function doUpload(uploads: ReadonlyArray<IUpload>) {

            if (uploads.length > 0) {

                async function doAsync() {

                    try {
                        const importedFiles = await handleUploads(uploads);
                        promptToOpenFiles(importedFiles);
                    } catch (e) {
                        log.error("Unable to upload files: ", uploads, e);
                    }

                }

                accountVerifiedAction(() => doAsync().catch(err => log.error(err)))


            } else {
                throw new Error("Unable to upload files.  Only PDF and EPUB uploads are supported.");
            }

        }

        return (uploads: ReadonlyArray<IUpload>) => {

            // we have to do three main things here:

            if (! uploads || uploads.length === 0) {
                log.warn("No dataTransfer files");
            }

            doUpload(uploads)
                .catch(err => log.error("Unable to handle upload: ", err));

        }

    }

}
