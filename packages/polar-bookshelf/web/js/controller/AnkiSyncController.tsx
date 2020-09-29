import React from 'react';
import {SyncProgressListener} from '../apps/sync/framework/SyncProgressListener';
import {AnkiSyncEngine} from '../apps/sync/framework/anki/AnkiSyncEngine';
import {DocMetaSupplierCollection} from '../metadata/DocMetaSupplierCollection';
import {Analytics} from "../analytics/Analytics";
import {useLogger} from "../mui/MUILogger";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../hooks/ReactLifecycleHooks";
import {usePersistenceLayerContext} from "../../../apps/repository/js/persistence_layer/PersistenceLayerApp";
import {useDialogManager} from "../mui/dialogs/MUIDialogControllers";
import {Percentage} from "polar-shared/src/util/ProgressTracker";

export const AnkiSyncController = React.memo(() => {

    const log = useLogger();
    const {persistenceLayerProvider} = usePersistenceLayerContext();
    const dialogManager = useDialogManager();

    const onMessageReceived = React.useCallback((event: MessageEvent) => {

        switch (event.data.type) {

            case "start-anki-sync":
                log.info("AnkiSyncController: started");
                onStartSync();
                break;

        }

    }, []);


    const messageListener = React.useCallback((event: MessageEvent) => {
        onMessageReceived(event)
    }, [])

    useComponentDidMount(() => {
        console.log("START Listening for Anki sync messages");
        window.addEventListener("message", messageListener, false);
    })

    useComponentWillUnmount(() => {
        console.log("STOP listening to Anki sync messages");
        window.removeEventListener("message", messageListener, false);
    })

    const onStartSync = React.useCallback(() => {

        async function doAsync(): Promise<void> {

            Analytics.event({category: 'anki', action: 'sync-started'});

            let nrTasks = 0;
            let nrFailedTasks = 0;

            const updateProgress = await dialogManager.taskbar({message: "Starting anki sync..."});

            updateProgress({value: 'indeterminate'});

            const syncProgressListener: SyncProgressListener = syncProgress => {

                log.info("Sync progress: ", syncProgress);

                syncProgress.taskResult.map(taskResult => ++nrTasks);

                syncProgress.taskResult
                    .filter(taskResult => taskResult.failed === true)
                    .map(taskResult => ++nrFailedTasks);

                updateProgress({
                    message: "Sending flashcards to Anki.",
                    value: syncProgress.percentage as Percentage
                });

            };

            const ankiSyncEngine = new AnkiSyncEngine();

            const persistenceLayer = persistenceLayerProvider();

            const docMetaFiles = await persistenceLayer.getDocMetaRefs();

            // TODO this is really slow - migrate it to using the already
            // in-memory sync'd copy of flashcards since I can useDocRepoStore
            // here
            const docMetaSuppliers: DocMetaSupplierCollection
                = docMetaFiles.map(docMetaFile => {
                    return async () => {
                        log.info("Reading docMeta for anki sync: " + docMetaFile.fingerprint);
                        return (await persistenceLayer.getDocMeta(docMetaFile.fingerprint))!;
                    };
                });

            const pendingSyncJob = await ankiSyncEngine.sync(docMetaSuppliers, syncProgressListener);

            updateProgress({value: 0});

            await pendingSyncJob.start();

            function finalNotifications() {

                const message = `Anki sync complete. Completed ${nrTasks} with ${nrFailedTasks} failures.`;

                updateProgress({
                    message,
                    value: 100
                });

                dialogManager.snackbar({message});

            }

            finalNotifications();

            Analytics.event({category: 'anki', action: 'sync-completed'});

        }

        doAsync()
            .catch(err => log.error("Could not sync to Anki: ", err));

    }, []);

    return null;

});
