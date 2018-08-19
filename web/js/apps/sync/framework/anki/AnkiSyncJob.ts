import {DocMetaSet} from '../../../../metadata/DocMetaSet';
import {SyncProgressListener} from '../SyncProgressListener';
import {PendingSyncJob, StartedSyncJob} from '../SyncJob';
import {DeckDescriptor} from './DeckDescriptor';
import {NoteDescriptor} from './NoteDescriptor';
import {DecksSync} from './DecksSync';
import {SyncQueue} from '../SyncQueue';
import {NotesSync} from './NotesSync';

abstract class AnkiSyncJob {

    protected readonly docMetaSet: DocMetaSet;
    protected readonly syncProgressListener: SyncProgressListener;
    protected readonly deckDescriptors: DeckDescriptor[];
    protected readonly noteDescriptors: NoteDescriptor[];

    public constructor(docMetaSet: DocMetaSet,
                          syncProgressListener: SyncProgressListener,
                          deckDescriptors: DeckDescriptor[],
                          noteDescriptors: NoteDescriptor[]) {
        this.docMetaSet = docMetaSet;
        this.syncProgressListener = syncProgressListener;
        this.deckDescriptors = deckDescriptors;
        this.noteDescriptors = noteDescriptors;
    }

}

export class PendingAnkiSyncJob extends AnkiSyncJob implements PendingSyncJob {

    async start(): Promise<StartedSyncJob> {

        let startedAnkiSyncJob = new StartedAnkiSyncJob(this.docMetaSet,
                                                        this.syncProgressListener,
                                                        this.deckDescriptors,
                                                        this.noteDescriptors);
        return startedAnkiSyncJob.run();

    }

}

export class StartedAnkiSyncJob extends AnkiSyncJob implements StartedSyncJob {

    public aborted = false;

    abort(): void {
        this.aborted = true;
    }

    async run(): Promise<this> {

        let syncQueue = new SyncQueue(this, this.syncProgressListener);

        let decksSync = new DecksSync(syncQueue);

        decksSync.enqueue(this.deckDescriptors);

        let notesSync = new NotesSync(syncQueue);

        notesSync.enqueue(this.noteDescriptors);

        await syncQueue.execute();

        return this;

    }

}
