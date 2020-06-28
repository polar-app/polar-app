import {AddFileRequest} from "../AddFileRequest";
import {DocImporter, ImportedFile} from "../importers/DocImporter";
import {useLogger} from "../../../mui/MUILogger";
import {usePersistenceLayerContext} from "../../../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {DeterminateProgressBar} from "../../../ui/progress_bar/DeterminateProgressBar";
import {ProgressTracker} from "polar-shared/src/util/ProgressTracker";
import {useDialogManager} from "../../../mui/dialogs/MUIDialogControllers";
import {AddFileRequests} from "../AddFileRequests";
import {WriteFileProgressListener} from "../../../datastore/Datastore";

export namespace AddFileHooks {

    export function useAddFileImporter() {

        const log = useLogger();
        const {persistenceLayerProvider} = usePersistenceLayerContext()
        const dialogManager = useDialogManager();

        async function doImportFiles(files: AddFileRequest[]): Promise<ReadonlyArray<ImportedFile>> {

            async function doFile(idx: number, file: AddFileRequest) {

                console.log("Importing file: ", file);

                const updateProgress =
                    await dialogManager.taskbar({message: `Uploading file ${idx} of ${files.length} file(s)`});

                updateProgress({value: 'indeterminate'});

                try {

                    const writeFileProgressListener: WriteFileProgressListener = (progress) => {
                        updateProgress({value: progress.progress});
                    };

                    const importedFile = await doImportFile(file, writeFileProgressListener);
                    log.info("Imported file: ", importedFile);
                    result.push(importedFile);

                } catch (e) {
                    log.error("Failed to import file: ", e, file);
                } finally {

                    const progress = progressTracker.incr();
                    // TODO this should be deprecated...
                    DeterminateProgressBar.update(progress);

                }

            }

            const progressTracker = new ProgressTracker({total: files.length, id: 'import-files'});

            const result: ImportedFile[] = [];

            try {

                let idx = 0;

                for (const file of files) {
                    ++idx;
                    await doFile(idx, file);
                }

                return result;

            } finally {
                // noop
            }

        }

        async function doImportFile(file: AddFileRequest,
                                    progressListener: WriteFileProgressListener): Promise<ImportedFile> {

            log.info("Importing file: ", file);

            return await DocImporter.importFile(persistenceLayerProvider,
                                                file.docPath,
                                                file.basename,
                                                {progressListener});

        }

        async function handleAddFileRequests(addFileRequests: AddFileRequest[]) {

            if (addFileRequests.length > 0) {

                // FIXME: needs to go back in after 2.0 is released
                // const accountUpgrader = new AccountUpgrader();
                //
                // if (await accountUpgrader.upgradeRequired()) {
                //     accountUpgrader.startUpgrade();
                //     return;
                // }

                try {
                    await doImportFiles(addFileRequests);
                } catch (e) {
                    log.error("Unable to import files: ", addFileRequests, e);
                }

            } else {
                throw new Error("Unable to upload files.  Only PDF and EPUB uploads are supported.");
            }

        }

        return (files: ReadonlyArray<File>) => {

            // we have to do three main things here:

            if (! files || files.length === 0) {
                log.warn("No dataTransfer");
            }

            async function doAsync() {

                const directly = AddFileRequests.computeFromFileList(files);
                // const recursively = await AddFileRequests.computeRecursively(event);
                const recursively: ReadonlyArray<AddFileRequest> = [];

                const addFileRequests = [...directly, ...recursively];

                await handleAddFileRequests(addFileRequests);

            }

            doAsync()
                .catch(err => log.error("Unable to handle upload: ", err));

        }


    }


}
