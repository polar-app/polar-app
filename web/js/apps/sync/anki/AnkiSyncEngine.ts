/**
 *
 */
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

export class AnkiSyncEngine implements SyncEngine {

    readonly descriptor: SyncEngineDescriptor = new AnkiSyncEngineDescriptor();


    public sync(docMetaSet: DocMetaSet, progress: SyncProgressListener): SyncJob {

        return new AnkiSyncJob();

    }

    protected toFlashcardHolders(docMetaSet: DocMetaSet): FlashcardHolder[] {

        let result: FlashcardHolder[] = [];

        docMetaSet.docMetas.forEach(docMeta => {
            Object.values(docMeta.pageMetas).forEach(pageMeta => {

                let flashcards: Flashcard[] = [];

                let textHighlights = pageMeta.textHighlights;

                flashcards.push(...Dictionaries.values(pageMeta.flashcards));

                //Dictionaries.values(pageMeta.textHighlights).ma

                //flashcards.push(...Dictionaries.values(pageMeta.textHighlights.flashcards));
                //
                // Dictionaries.values(pageMeta.flashcards).forEach(flashcard => {
                //     let t: FlashcardHolder = { docMeta, flashcard, pageInfo: pageMeta.pageInfo};
                //     result.push(t);https://www.youtube.com/watch?v=lXQKOpQXuh8
                // });

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

interface FlashcardHolder {

    readonly docMeta: DocMeta;

    readonly pageInfo: PageInfo;

    readonly flashcard: Flashcard;
}


/*
class FlashcardHolder {

    public readonly docMeta: DocMeta;

    public readonly flashcard: Flashcard;

    constructor(docMeta: DocMeta, flashcard: Flashcard) {
        this.docMeta = docMeta;
        this.flashcard = flashcard;
    }

}
*/

class AnkiSyncJob implements SyncJob {

    abort(): void {

    }

}

class AnkiSyncEngineDescriptor implements SyncEngineDescriptor {

    readonly id: string = "a0138889-ff14-41e8-9466-42d960fe80d9";

    readonly name: string = "anki";

    readonly description: string = "Sync Engine for Anki";

}
