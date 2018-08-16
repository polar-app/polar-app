import {SyncEngine} from '../SyncEngine';
import {SyncEngineDescriptor} from '../SyncEngineDescriptor';
import {DocMetaSet} from '../../../metadata/DocMetaSet';
import {SyncProgressListener} from '../SyncProgressListener';
import {SyncJob} from '../SyncJob';
import {DocMeta} from '../../../metadata/DocMeta';
import {Flashcard} from '../../../metadata/Flashcard';
import {PageInfo} from '../../../metadata/PageInfo';
import {Dictionaries} from '../../../util/Dictionaries';
import * as _ from "lodash";

/**
 * Sync engine for Anki.  Takes cards registered in a DocMeta and then transfers
 * them over to Anki.
 */
export class AnkiSyncEngine implements SyncEngine {

    readonly descriptor: SyncEngineDescriptor = new AnkiSyncEngineDescriptor();


    public sync(docMetaSet: DocMetaSet, progress: SyncProgressListener): SyncJob {

        return new AnkiSyncJob();

    }

    protected toFlashcardHolders(docMetaSet: DocMetaSet): FlashcardHolder[] {

        let result: FlashcardHolder[] = [];

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

                let flashcardHolders =_.chain(flashcards)
                    .map(current => <FlashcardHolder> {
                        docMeta,
                        pageInfo: pageMeta.pageInfo,
                        flashcard: current
                    })
                    .value();

                result.push(...flashcardHolders);

            })
        });

        return result;

    }

    /**
     * We need to decompose this into flashcards so that we can compute the
     * correct progress and Flashcards are the only thing we're syncing here.
     *
     */
    protected syncFlashcards(docMetas: DocMetaSet, progress: SyncProgressListener): SyncJob {

        return new AnkiSyncJob();

    }

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

export interface FlashcardHolder {

    readonly docMeta: DocMeta;

    readonly pageInfo: PageInfo;

    readonly flashcard: Flashcard;
}


class AnkiSyncJob implements SyncJob {

    abort(): void {

        // run DecksSync
        // run NotesSync

        // see which notes are in the decks
        // if they are updated, update them
        // if they are missing, create them.

    }

}

class AnkiSyncEngineDescriptor implements SyncEngineDescriptor {

    readonly id: string = "a0138889-ff14-41e8-9466-42d960fe80d9";

    readonly name: string = "anki";

    readonly description: string = "Sync Engine for Anki";

}
