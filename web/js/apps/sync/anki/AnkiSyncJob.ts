import {DocMetaSet} from '../../../metadata/DocMetaSet';
import {SyncProgressListener} from '../SyncProgressListener';
import {PendingSyncJob, StartedSyncJob} from '../SyncJob';
import {DeckDescriptor} from './DeckDescriptor';
import {NoteDescriptor} from './NoteDescriptor';
import {DecksSync} from './DecksSync';

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

        let decksSync = new DecksSync();

        await decksSync.sync(this.deckDescriptors, this, this.syncProgressListener);

        // run DecksSync
        // run NotesSync

        // see which notes are in the decks
        // if they are updated, update them
        // if they are missing, create them.

        return this;

    }

}
