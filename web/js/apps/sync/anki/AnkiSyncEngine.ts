import {SyncEngine} from '../SyncEngine';
import {SyncEngineDescriptor} from '../SyncEngineDescriptor';
import {DocMetaSet} from '../../../metadata/DocMetaSet';
import {SyncProgressListener} from '../SyncProgressListener';
import {PendingSyncJob, StartedSyncJob} from '../SyncJob';
import {DocMeta} from '../../../metadata/DocMeta';
import {Flashcard} from '../../../metadata/Flashcard';
import {PageInfo} from '../../../metadata/PageInfo';
import {Dictionaries} from '../../../util/Dictionaries';
import * as _ from "lodash";
import {DeckDescriptor} from './DeckDescriptor';
import {NoteDescriptor} from './NoteDescriptor';
import {Optional} from '../../../util/ts/Optional';

/**
 * Sync engine for Anki.  Takes cards registered in a DocMeta and then transfers
 * them over to Anki.
 */
export class AnkiSyncEngine implements SyncEngine {

    readonly descriptor: SyncEngineDescriptor = new AnkiSyncEngineDescriptor();

    public sync(docMetaSet: DocMetaSet, progress: SyncProgressListener): PendingSyncJob {

        return new PendingAnkiSyncJob(docMetaSet, progress);

    }

    protected toDeckDescriptors(docMetaSet: DocMetaSet) {

        let result: DeckDescriptor[] = [];

        docMetaSet.docMetas.forEach(docMeta => {

            let name = docMeta.docInfo.title;

            if(! name) {
                throw new Error("No name for docMeta: "  + docMeta.docInfo.fingerprint);
            }

            result.push({
                name
            });

        });

        return result;

    }

    protected toNoteDescriptors(docMetaSet: DocMetaSet): NoteDescriptor[] {

        return this.toFlashcardDescriptors(docMetaSet).map(current => {

            let deckName = Optional.of(current.docMeta.docInfo.title, 'title').get();

            let fields: {[name: string]: string} = {};


            return {
                guid: current.flashcard.guid,
                deckName: deckName,
                // FIXME: we need to handle the model name for now...
                modelName: "unknown",
                fields,
                tags: []
            };

        });

    }

    protected toFlashcardDescriptors(docMetaSet: DocMetaSet): FlashcardDescriptor[] {

        let result: FlashcardDescriptor[] = [];

        docMetaSet.docMetas.forEach(docMeta => {
            Object.values(docMeta.pageMetas).forEach(pageMeta => {

                // collect all flashcards for the current page.

                let flashcards: Flashcard[] = [];

                flashcards.push(... Dictionaries.values(pageMeta.flashcards));

                flashcards.push(... _.chain(pageMeta.textHighlights)
                    .map(current => Dictionaries.values(current.flashcards))
                    .flatten()
                    .value());

                flashcards.push(... _.chain(pageMeta.areaHighlights)
                    .map(current => Dictionaries.values(current.flashcards))
                    .flatten()
                    .value());

                let flashcardDescriptors =_.chain(flashcards)
                    .map(current => <FlashcardDescriptor> {
                        docMeta,
                        pageInfo: pageMeta.pageInfo,
                        flashcard: current
                    })
                    .value();

                result.push(...flashcardDescriptors);

            })
        });

        return result;

    }

    /**
     * We need to decompose this into flashcards so that we can compute the
     * correct progress and Flashcards are the only thing we're syncing here.
     *
     */
    // protected syncFlashcards(docMetas: DocMetaSet, progress: SyncProgressListener): SyncJob {
    //
    //     return new AnkiSyncJob();
    //
    // }

    // https://github.com/FooSoft/anki-connect

    // initial design:
    //
    // always write to a deck named for the document.  No support for rename or
    // anything else fancy in the first version.
    //
    // call getNote
    //
    // TODO: which model to use to write with???

    // getDecks.

}

export interface FlashcardDescriptor {

    readonly docMeta: DocMeta;

    readonly pageInfo: PageInfo;

    readonly flashcard: Flashcard;
}


abstract class AnkiSyncJob {

    protected readonly docMetaSet: DocMetaSet;
    protected readonly progress: SyncProgressListener;

    constructor(docMetaSet: DocMetaSet, progress: SyncProgressListener) {
        this.docMetaSet = docMetaSet;
        this.progress = progress;
    }

}

class PendingAnkiSyncJob extends AnkiSyncJob implements PendingSyncJob {

    start(): StartedSyncJob {

        return new StartedAnkiSyncJob(this.docMetaSet, this.progress).run();

    }

}

class StartedAnkiSyncJob extends AnkiSyncJob implements StartedSyncJob {

    private aborted = false;

    abort(): void {
        this.aborted = true;
    }

    run(): this {

        // run DecksSync
        // run NotesSync

        // see which notes are in the decks
        // if they are updated, update them
        // if they are missing, create them.

        return this;

    }

}

class AnkiSyncEngineDescriptor implements SyncEngineDescriptor {

    readonly id: string = "a0138889-ff14-41e8-9466-42d960fe80d9";

    readonly name: string = "anki";

    readonly description: string = "Sync Engine for Anki";

}
