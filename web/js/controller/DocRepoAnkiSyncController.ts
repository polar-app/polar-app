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

const log = Logger.create();

export class AnkiSyncController {

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
                this.onStartSync(triggerEvent);
                break;

        }

    }

    private async onStartSync(triggerEvent: TriggerEvent) {

        // await this.persistenceLayer.getDocMetaFiles();
        //
        // const docMetaSet = new DocMetaSet(docMeta);
        //
        // const syncProgressListener: SyncProgressListener = syncProgress => {
        //
        //     log.info("Sync progress: ", syncProgress);
        //
        //     let message: string | undefined;
        //
        //     syncProgress.taskResult.when(taskResult => {
        //         message = taskResult.message;
        //     });
        //
        //     this.syncBarProgress.dispatchEvent({
        //         task: 'anki-sync',
        //         title: message,
        //         percentage: syncProgress.percentage
        //     });
        //
        // };
        //
        // const ankiSyncEngine = new AnkiSyncEngine();
        //
        // const pendingSyncJob = ankiSyncEngine.sync(docMetaSet, syncProgressListener);
        //
        // await pendingSyncJob.start();
        //
        // this.syncBarProgress.dispatchEvent({
        //     task: 'anki-sync',
        //     title: "Anki sync complete",
        //     percentage: 100
        // });

    }

}
