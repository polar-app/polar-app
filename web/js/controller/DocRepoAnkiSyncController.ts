import {TriggerEvent} from '../contextmenu/TriggerEvent';
import {Logger} from '../logger/Logger';
import {Model} from '../model/Model';
import {Strings} from '../util/Strings';
import {Toaster} from '../toaster/Toaster';
import {DialogWindowClient} from '../ui/dialog_window/DialogWindowClient';
import {DialogWindowOptions, Resource, ResourceType} from '../ui/dialog_window/DialogWindow';
import {DocInfos} from '../metadata/DocInfos';
import {DocMetaSet} from '../metadata/DocMetaSet';
import {SyncProgressListener} from '../apps/sync/framework/SyncProgressListener';
import {IPersistenceLayer} from '../datastore/IPersistenceLayer';
import {IEventDispatcher} from '../reactor/SimpleReactor';
import {SyncBarProgress} from '../ui/sync_bar/SyncBar';
import {AnkiSyncEngine} from '../apps/sync/framework/anki/AnkiSyncEngine';
import {DocMetaSupplierCollection} from '../metadata/DocMetaSupplierCollection';
import {DocMeta} from '../metadata/DocMeta';

const log = Logger.create();

export class DocRepoAnkiSyncController {

    private readonly persistenceLayer: IPersistenceLayer;
    private readonly syncBarProgress: IEventDispatcher<SyncBarProgress>;

    constructor(persistenceLayer: IPersistenceLayer, syncBarProgress: IEventDispatcher<SyncBarProgress>) {
        this.persistenceLayer = persistenceLayer;
        this.syncBarProgress = syncBarProgress;
    }

    public start() {
        window.addEventListener("message", event => this.onMessageReceived(event), false);
    }

    private onMessageReceived(event: any) {

        log.info("Received message: ", event);

        const triggerEvent = event.data;

        switch (event.data.type) {

            case "start-anki-sync":
                this.onStartSync();
                break;

        }

    }

    private async onStartSync() {

        const syncProgressListener: SyncProgressListener = syncProgress => {

            log.info("Sync progress: ", syncProgress);

            let message: string | undefined;

            syncProgress.taskResult.when(taskResult => {
                message = taskResult.message;
            });

            this.syncBarProgress.dispatchEvent({
                task: 'anki-sync',
                title: message,
                percentage: syncProgress.percentage
            });

        };

        const ankiSyncEngine = new AnkiSyncEngine();

        const docMetaFiles = await this.persistenceLayer.getDocMetaFiles();

        const docMetaSuppliers: DocMetaSupplierCollection
            = docMetaFiles.map(docMetaFile => {
                return async () => {
                    log.info("Reading docMeta for anki sync: " + docMetaFile.fingerprint);
                    return (await this.persistenceLayer.getDocMeta(docMetaFile.fingerprint))!;
                }});

        const pendingSyncJob = await ankiSyncEngine.sync(docMetaSuppliers, syncProgressListener);

        this.syncBarProgress.dispatchEvent({
            task: 'anki-sync',
            title: "Starting anki sync...",
            percentage: 0
        });

        await pendingSyncJob.start();

        this.syncBarProgress.dispatchEvent({
            task: 'anki-sync',
            title: "Anki sync complete.",
            percentage: 100
        });

    }

}
