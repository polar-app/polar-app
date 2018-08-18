import {SyncEngine} from '../SyncEngine';
import {SyncEngineDescriptor} from '../SyncEngineDescriptor';
import {DocMetaSet} from '../../../../metadata/DocMetaSet';
import {SyncProgressListener} from '../SyncProgressListener';
import {PendingSyncJob} from '../SyncJob';
import {DocMeta} from '../../../../metadata/DocMeta';
import {Flashcard} from '../../../../metadata/Flashcard';
import {PageInfo} from '../../../../metadata/PageInfo';
import {Dictionaries} from '../../../../util/Dictionaries';
import * as _ from "lodash";
import {DeckDescriptor} from './DeckDescriptor';
import {NoteDescriptor} from './NoteDescriptor';
import {Optional} from '../../../../util/ts/Optional';
import {PendingAnkiSyncJob} from './AnkiSyncJob';

/**
 * Sync engine for Anki.  Takes cards registered in a DocMeta and then transfers
 * them over to Anki.
 */
export class AnkiSyncEngine implements SyncEngine {

    readonly descriptor: SyncEngineDescriptor = new AnkiSyncEngineDescriptor();

    public sync(docMetaSet: DocMetaSet, progress: SyncProgressListener): PendingSyncJob {

        let deckDescriptors = this.toDeckDescriptors(docMetaSet);
        let noteDescriptors = this.toNoteDescriptors(docMetaSet);

        return new PendingAnkiSyncJob(docMetaSet, progress, deckDescriptors, noteDescriptors);

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

        return this.toFlashcardDescriptors(docMetaSet).map(flashcardDescriptor => {

            let deckName = Optional.of(flashcardDescriptor.docMeta.docInfo.title, 'title').get();

            let fields: {[name: string]: string} = {};

            // need to create the fields 'front' and 'Back'

            Dictionaries.forDict(flashcardDescriptor.flashcard.fields, (key, value) => {
                fields[key] = Optional.of(value.HTML || value.TEXT || value.MARKDOWN).get();
            });

            return {
                guid: flashcardDescriptor.flashcard.guid,
                deckName: deckName,
                modelName: "Basic",
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

}

export interface FlashcardDescriptor {

    readonly docMeta: DocMeta;

    readonly pageInfo: PageInfo;

    readonly flashcard: Flashcard;
}



class AnkiSyncEngineDescriptor implements SyncEngineDescriptor {

    readonly id: string = "a0138889-ff14-41e8-9466-42d960fe80d9";

    readonly name: string = "anki";

    readonly description: string = "Sync Engine for Anki";

}
