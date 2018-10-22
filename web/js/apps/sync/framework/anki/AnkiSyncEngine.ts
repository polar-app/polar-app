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
import {DocInfos} from '../../../../metadata/DocInfos';
import {Tags} from '../../../../tags/Tags';
import {DocInfo} from '../../../../metadata/DocInfo';

/**
 * Sync engine for Anki.  Takes cards registered in a DocMeta and then transfers
 * them over to Anki.
 */
export class AnkiSyncEngine implements SyncEngine {

    readonly descriptor: SyncEngineDescriptor = new AnkiSyncEngineDescriptor();

    public sync(docMetaSet: DocMetaSet, progress: SyncProgressListener): PendingSyncJob {

        const deckDescriptors = this.toDeckDescriptors(docMetaSet);
        const noteDescriptors = this.toNoteDescriptors(docMetaSet);

        return new PendingAnkiSyncJob(docMetaSet, progress, deckDescriptors, noteDescriptors);

    }

    protected toDeckDescriptors(docMetaSet: DocMetaSet) {

        const result: DeckDescriptor[] = [];

        docMetaSet.docMetas.forEach(docMeta => {

            const name = this.computeDeckName(docMeta.docInfo);

            if (! name) {
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

            const deckName = this.computeDeckName(flashcardDescriptor.docMeta.docInfo);

            const fields: {[name: string]: string} = {};

            // need to create the fields 'front' and 'Back'

            Dictionaries.forDict(flashcardDescriptor.flashcard.fields, (key, value) => {
                fields[key] = Optional.of(value.HTML || value.TEXT || value.MARKDOWN).get();
            });

            const docInfoTags = Optional.of(flashcardDescriptor.docMeta.docInfo.tags)

            const tags = docInfoTags.map(current => Object.values(current))
                       .getOrElse([])
                       .map(tag => tag.label);

            return {
                guid: flashcardDescriptor.flashcard.guid,
                deckName,
                modelName: "Basic",
                fields,
                tags
            };

        });

    }

    protected computeDeckName(docInfo: DocInfo): string {

        let deckName;

        const tags = docInfo.tags;

        if (tags) {

            // TODO: test this..

            deckName = Object.values(tags)
                .filter(tag => tag.label.startsWith("deck:"))
                .map(tag => Tags.parseTypedTag(tag.label))
                .filter(typedTag => typedTag.isPresent())
                .map(typedTag => typedTag.get())
                .map(typedTag => typedTag.value)
                .pop();

        }

        if (! deckName) {
            deckName = DocInfos.bestTitle(docInfo);
        }

        return deckName;

    }

    protected toFlashcardDescriptors(docMetaSet: DocMetaSet): FlashcardDescriptor[] {

        const result: FlashcardDescriptor[] = [];

        docMetaSet.docMetas.forEach(docMeta => {
            Object.values(docMeta.pageMetas).forEach(pageMeta => {

                // collect all flashcards for the current page.

                const flashcards: Flashcard[] = [];

                flashcards.push(... Dictionaries.values(pageMeta.flashcards));

                flashcards.push(... _.chain(pageMeta.textHighlights)
                    .map(current => Dictionaries.values(current.flashcards))
                    .flatten()
                    .value());

                flashcards.push(... _.chain(pageMeta.areaHighlights)
                    .map(current => Dictionaries.values(current.flashcards))
                    .flatten()
                    .value());

                const flashcardDescriptors =_.chain(flashcards)
                    .map(current => <FlashcardDescriptor> {
                        docMeta,
                        pageInfo: pageMeta.pageInfo,
                        flashcard: current
                    })
                    .value();

                result.push(...flashcardDescriptors);

            });

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
