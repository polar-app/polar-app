import React from 'react';
import {SyncProgressListener} from '../apps/sync/framework/SyncProgressListener';
import {AnkiSyncEngine} from '../apps/sync/framework/anki/AnkiSyncEngine';
import {Analytics} from "../analytics/Analytics";
import {useLogger} from "../mui/MUILogger";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/ReactLifecycleHooks";
import {
    useRepoDocMetaManager
} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {Percentage} from "polar-shared/src/util/ProgressTracker";
import {DocMetaSupplier} from "../metadata/DocMetaSupplier";
import {AnkiSyncError} from "../apps/sync/framework/anki/AnkiSyncError";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {MUILinkLoaderButton} from "../mui/MUILinkLoaderButton";

export const AnkiSyncController = React.memo(function AnkiSyncController() {

    const log = useLogger();
    const dialogManager = useDialogManager();

    const repoDocMetaManager = useRepoDocMetaManager();

    const createDocMetaSuppliers = React.useCallback((): ReadonlyArray<DocMetaSupplier> => {

        return repoDocMetaManager.repoDocInfoIndex.values().map(current => async () => current.docMeta);

    }, [repoDocMetaManager]);

    const onStartSync = React.useCallback(() => {

        async function doAsync(): Promise<void> {

            Analytics.event2('anki-syncStarted');

            let nrTasks = 0;
            let nrFailedTasks = 0;

            const updateProgress = await dialogManager.taskbar({message: "Starting anki sync..."});

            try {

                updateProgress({value: 'indeterminate'});

                const syncProgressListener: SyncProgressListener = syncProgress => {

                    log.info("Sync progress: ", syncProgress);

                    syncProgress.taskResult.map(() => ++nrTasks);

                    syncProgress.taskResult
                        .filter(taskResult => taskResult.failed === true)
                        .map(() => ++nrFailedTasks);

                    updateProgress({
                        message: "Sending flashcards to Anki.",
                        value: syncProgress.percentage as Percentage
                    });

                };

                const ankiSyncEngine = new AnkiSyncEngine();

                // async function createDocMetaSuppliersFromPersistenceLayer(): Promise<DocMetaSupplierCollection> {
                //
                //     // this is the OLD strategy for receiving DocMeta suppliers and is super slow.
                //
                //     const persistenceLayer = persistenceLayerProvider();
                //
                //     const docMetaFiles = await persistenceLayer.getDocMetaRefs();
                //
                //     // TODO this is really slow - migrate it to using the already
                //     // in-memory sync'd copy of flashcards since I can useDocRepoStore
                //     // here
                //     return docMetaFiles.map(docMetaFile => {
                //         return async () => {
                //             log.info("Reading docMeta for anki sync: " + docMetaFile.fingerprint);
                //             return (await persistenceLayer.getDocMeta(docMetaFile.fingerprint))!;
                //         };
                //     });
                //
                // }

                // const docMetaSuppliers = await createDocMetaSuppliersFromPersistenceLayer();
                const docMetaSuppliers = createDocMetaSuppliers();

                const pendingSyncJob = await ankiSyncEngine.sync(docMetaSuppliers, syncProgressListener);

                updateProgress({value: 0});

                await pendingSyncJob.start();

                function finalNotifications() {

                    const message = `Anki sync complete. Completed ${nrTasks} tasks with ${nrFailedTasks} failures.`;

                    updateProgress({
                        message,
                        value: 100
                    });

                    dialogManager.snackbar({message});

                }

                finalNotifications();

                Analytics.event2('anki-syncCompleted', { noSucceeded: nrTasks - nrFailedTasks, noFailed: nrFailedTasks });
            } finally {
                updateProgress('terminate');
            }
        }

        function handleError(err: Error) {
            if (err instanceof AnkiSyncError) {

                console.error("Could not sync to Anki: ", err);

                dialogManager.confirm({
                    type: 'error',
                    title: "Could not sync to Anki",
                    subtitle: (
                        <>
                            We were unable to sync to Anki.  But don't worry - it's probably one of the following
                            items:

                            <ul>
                                <li>Make sure Anki is running.</li>

                                <li>

                                    Make sure you have the Anki Connect add-on installed.

                                    <p>
                                        <MUILinkLoaderButton href="https://ankiweb.net/shared/info/2055492159" variant="contained">
                                            Install Anki Connect
                                        </MUILinkLoaderButton>
                                    </p>

                                </li>

                                <li>
                                    Make sure you don't have a firewall preventing us from connecting to port 8765.
                                </li>
                            </ul>

                        </>
                    ),
                    noCancel: true,
                    onAccept: NULL_FUNCTION
                });

            } else {
                log.error("Could not sync to Anki: ", err);
            }
            Analytics.event2('anki-syncFailed');
        }

        doAsync()
            .catch(handleError);

    }, [log, dialogManager, createDocMetaSuppliers]);

    const onMessageReceived = React.useCallback((event: MessageEvent) => {

        switch (event.data.type) {

            case "start-anki-sync":
                log.info("AnkiSyncController: started");
                onStartSync();
                break;

        }

    }, [log, onStartSync]);

    const messageListener = React.useCallback((event: MessageEvent) => onMessageReceived(event), [onMessageReceived])

    useComponentDidMount(() => {
        console.log("START Listening for Anki sync messages");
        window.addEventListener("message", messageListener, false);
    })

    useComponentWillUnmount(() => {
        console.log("STOP listening to Anki sync messages");
        window.removeEventListener("message", messageListener, false);
    })

    return null;

});
