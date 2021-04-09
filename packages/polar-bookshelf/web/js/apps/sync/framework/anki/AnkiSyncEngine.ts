import {SyncEngine} from '../SyncEngine';
import {SyncEngineDescriptor} from '../SyncEngineDescriptor';
import {SyncProgressListener} from '../SyncProgressListener';
import {PendingSyncJob} from '../SyncJob';
import {Dictionaries} from 'polar-shared/src/util/Dictionaries';
import {DeckDescriptor} from './DeckDescriptor';
import {NoteDescriptor} from './NoteDescriptor';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {PendingAnkiSyncJob} from './AnkiSyncJob';
import {DocInfos} from '../../../../metadata/DocInfos';
import {Tags} from 'polar-shared/src/tags/Tags';
import {DocMetaSupplierCollection} from '../../../../metadata/DocMetaSupplierCollection';
import {SetArrays} from 'polar-shared/src/util/SetArrays';
import {FlashcardDescriptors} from './FlashcardDescriptors';
import {AnkiConnectFetch} from './AnkiConnectFetch';
import {Decks} from './Decks';
import {ModelNamesClient} from "./clients/ModelNamesClient";
import {ModelNames} from "./ModelNames";
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import {CreateModeClient, ICreateModelOpts} from "./clients/CreateModelClient";
import {isPresent} from "polar-shared/src/Preconditions";

/**
 * Sync engine for Anki.  Takes cards registered in a DocMeta and then transfers
 * them over to Anki.
 */
export class AnkiSyncEngine implements SyncEngine {

    public readonly descriptor: SyncEngineDescriptor = new AnkiSyncEngineDescriptor();

    public async sync(docMetaSupplierCollection: DocMetaSupplierCollection,
                      progress: SyncProgressListener,
                      deckNameStrategy: DeckNameStrategy = 'default'): Promise<PendingSyncJob> {

        // determine how to connect to Anki
        await AnkiConnectFetch.initialize();

        await this.verifyRequiredModels();

        const noteDescriptors = await this.toNoteDescriptors(deckNameStrategy, docMetaSupplierCollection);

        const deckNames = SetArrays.toSet(noteDescriptors.map(noteDescriptor => noteDescriptor.deckName));

        console.log("Going to sync over N notes: " + noteDescriptors.length);

        const deckDescriptors: DeckDescriptor[] = Array.from(deckNames)
            .map(deckName => {
                return {name: deckName};
            });

        return new PendingAnkiSyncJob(progress, deckDescriptors, noteDescriptors);

    }

    /**
     * Anki doesn't allow cards with empty fields so filter these so we don't return errors.
     */
    private filterInvalidNoteDescriptors(noteDescriptors: ReadonlyArray<NoteDescriptor>) {

        function isInvalid(note: NoteDescriptor) {
            const emptyFields
                = Object.values(note.fields)
                        .filter(current => ! isPresent(current) || current.trim() === '')

            return emptyFields.length > 0;

        }

        return noteDescriptors.filter(current => ! isInvalid(current));

    }

    private async createRequiredModelForBasic() {

        console.log("Creating Basic Anki model");

        const opts: ICreateModelOpts = {
            modelName: "Basic",
            inOrderFields: ["Front", "FrontSide", "Back"],
            cardTemplates: [
                {
                    Name: "Card 1",
                    Front: "{{Front}}",
                    Back: "{{FrontSide}}\n\n<hr id=answer>\n\n{{Back}}"
                }
            ]
        };

        const client = new CreateModeClient();
        await client.execute(opts);

    }

    private async createRequiredModelForCloze() {

        console.log("Creating Cloze Anki model");

        const opts: ICreateModelOpts = {
            modelName: "Cloze",
            inOrderFields: ["Text", "Back Extra"],
            css: ".card {\n" +
                "  font-family: arial;\n" +
                "  font-size: 20px;\n" +
                "  text-align: center;\n" +
                "  color: black;\n" +
                "  background-color: white;\n" +
                "}\n" +
                "\n" +
                ".cloze {\n" +
                " font-weight: bold;\n" +
                " color: blue;\n" +
                "}\n" +
                ".nightMode .cloze {\n" +
                " color: lightblue;\n" +
                "}\n",
            cardTemplates: [
                {
                    Name: "Card 1",
                    Front: "{{cloze:Text}}",
                    Back: "{{cloze:Text}}<br>\n{{Back Extra}}"
                }
            ]
        };

        const client = new CreateModeClient();
        await client.execute(opts);

    }

    private async createRequiredModels(missing: ReadonlyArray<string>) {

        if (missing.includes('Basic')) {
            await this.createRequiredModelForBasic();
        }

        if (missing.includes('Cloze')) {
            await this.createRequiredModelForCloze();
        }

    }

    private async verifyRequiredModels() {

        // TODO: add new models in the future.

        const modelNotesClient = new ModelNamesClient();
        const modelNames = await modelNotesClient.execute();
        const missing = ModelNames.verifyRequired(modelNames);

        await this.createRequiredModels(missing);


    }

    protected async toNoteDescriptors(deckNameStrategy: DeckNameStrategy,
                                      docMetaSupplierCollection: DocMetaSupplierCollection): Promise<ReadonlyArray<NoteDescriptor>> {

        const  flashcardDescriptors = await FlashcardDescriptors.toFlashcardDescriptors(docMetaSupplierCollection);

        return flashcardDescriptors.map(flashcardDescriptor => {

            const deckName = this.computeDeckName(deckNameStrategy, flashcardDescriptor.docMeta.docInfo);

            const fields: {[name: string]: string} = {};

            // need to create the fields 'front' and 'back'
            Dictionaries.forDict(flashcardDescriptor.flashcard.fields, (key, value) => {
                fields[key] = Optional.of(value.HTML || value.TEXT || value.MARKDOWN).getOrElse('');
            });

            const annotationTagsMap = flashcardDescriptor.flashcard.tags || {};
            const docInfoTagsMap = flashcardDescriptor.docMeta.docInfo.tags || {};

            const tagsMap = {...docInfoTagsMap, ...annotationTagsMap};

            const tags = Object.values(tagsMap)
                               .map(tag => tag.label);

            // TODO: implement more model types... not just basic.

            const modelName = FlashcardDescriptors.toModelName(flashcardDescriptor);

            return {
                guid: flashcardDescriptor.flashcard.guid,
                deckName,
                modelName,
                fields,
                tags
            };

        });

    }

    protected computeDeckName(deckNameStrategy: DeckNameStrategy, docInfo: IDocInfo): string {

        let deckName: string | undefined;

        const tags = docInfo.tags;

        if (tags) {

            // TODO: test this..

            deckName = Object.values(tags)
                .filter(tag => tag.label.startsWith("deck:"))
                .map(tag => Tags.parseTypedTag(tag.label))
                .filter(typedTag => typedTag.isPresent())
                .map(typedTag => typedTag.get())
                .map(typedTag => Decks.toSubDeck(typedTag.value))
                .pop();
        }

        if (! deckName) {

            if (deckNameStrategy === 'default') {
                return "Default";
            }

            deckName = DocInfos.bestTitle(docInfo);

        }

        return deckName;

    }

}


class AnkiSyncEngineDescriptor implements SyncEngineDescriptor {

    public readonly id: string = "a0138889-ff14-41e8-9466-42d960fe80d9";

    public readonly name: string = "anki";

    public readonly description: string = "Sync Engine for Anki";

}

/**
 * The strategy for computing the deck name for the flashcards.
 *
 * default: Use the Default deck.
 *
 * per-document: Create a deck per document.
 */
export type DeckNameStrategy = 'default' | 'per-document';
