"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnkiSyncEngine = void 0;
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const AnkiSyncJob_1 = require("./AnkiSyncJob");
const DocInfos_1 = require("../../../../metadata/DocInfos");
const Tags_1 = require("polar-shared/src/tags/Tags");
const SetArrays_1 = require("polar-shared/src/util/SetArrays");
const FlashcardDescriptors_1 = require("./FlashcardDescriptors");
const AnkiConnectFetch_1 = require("./AnkiConnectFetch");
const Decks_1 = require("./Decks");
const ModelNamesClient_1 = require("./clients/ModelNamesClient");
const ModelNames_1 = require("./ModelNames");
const CreateModelClient_1 = require("./clients/CreateModelClient");
class AnkiSyncEngine {
    constructor() {
        this.descriptor = new AnkiSyncEngineDescriptor();
    }
    sync(docMetaSupplierCollection, progress, deckNameStrategy = 'default') {
        return __awaiter(this, void 0, void 0, function* () {
            yield AnkiConnectFetch_1.AnkiConnectFetch.initialize();
            yield this.verifyRequiredModels();
            const noteDescriptors = yield this.toNoteDescriptors(deckNameStrategy, docMetaSupplierCollection);
            const deckNames = SetArrays_1.SetArrays.toSet(noteDescriptors.map(noteDescriptor => noteDescriptor.deckName));
            console.log("Going to sync over N notes: " + noteDescriptors.length);
            const deckDescriptors = Array.from(deckNames)
                .map(deckName => {
                return { name: deckName };
            });
            return new AnkiSyncJob_1.PendingAnkiSyncJob(progress, deckDescriptors, noteDescriptors);
        });
    }
    createRequiredModelForBasic() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creating Basic Anki model");
            const opts = {
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
            const client = new CreateModelClient_1.CreateModeClient();
            yield client.execute(opts);
        });
    }
    createRequiredModelForCloze() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Creating Cloze Anki model");
            const opts = {
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
            const client = new CreateModelClient_1.CreateModeClient();
            yield client.execute(opts);
        });
    }
    createRequiredModels(missing) {
        return __awaiter(this, void 0, void 0, function* () {
            if (missing.includes('Basic')) {
                yield this.createRequiredModelForBasic();
            }
            if (missing.includes('Cloze')) {
                yield this.createRequiredModelForCloze();
            }
        });
    }
    verifyRequiredModels() {
        return __awaiter(this, void 0, void 0, function* () {
            const modelNotesClient = new ModelNamesClient_1.ModelNamesClient();
            const modelNames = yield modelNotesClient.execute();
            const missing = ModelNames_1.ModelNames.verifyRequired(modelNames);
            yield this.createRequiredModels(missing);
        });
    }
    toNoteDescriptors(deckNameStrategy, docMetaSupplierCollection) {
        return __awaiter(this, void 0, void 0, function* () {
            const flashcardDescriptors = yield FlashcardDescriptors_1.FlashcardDescriptors.toFlashcardDescriptors(docMetaSupplierCollection);
            return flashcardDescriptors.map(flashcardDescriptor => {
                const deckName = this.computeDeckName(deckNameStrategy, flashcardDescriptor.docMeta.docInfo);
                const fields = {};
                Dictionaries_1.Dictionaries.forDict(flashcardDescriptor.flashcard.fields, (key, value) => {
                    fields[key] = Optional_1.Optional.of(value.HTML || value.TEXT || value.MARKDOWN).getOrElse('');
                });
                const annotationTagsMap = flashcardDescriptor.flashcard.tags || {};
                const docInfoTagsMap = flashcardDescriptor.docMeta.docInfo.tags || {};
                const tagsMap = Object.assign(Object.assign({}, docInfoTagsMap), annotationTagsMap);
                const tags = Object.values(tagsMap)
                    .map(tag => tag.label);
                const modelName = FlashcardDescriptors_1.FlashcardDescriptors.toModelName(flashcardDescriptor);
                return {
                    guid: flashcardDescriptor.flashcard.guid,
                    deckName,
                    modelName,
                    fields,
                    tags
                };
            });
        });
    }
    computeDeckName(deckNameStrategy, docInfo) {
        let deckName;
        const tags = docInfo.tags;
        if (tags) {
            deckName = Object.values(tags)
                .filter(tag => tag.label.startsWith("deck:"))
                .map(tag => Tags_1.Tags.parseTypedTag(tag.label))
                .filter(typedTag => typedTag.isPresent())
                .map(typedTag => typedTag.get())
                .map(typedTag => Decks_1.Decks.toSubDeck(typedTag.value))
                .pop();
        }
        if (!deckName) {
            if (deckNameStrategy === 'default') {
                return "Default";
            }
            deckName = DocInfos_1.DocInfos.bestTitle(docInfo);
        }
        return deckName;
    }
}
exports.AnkiSyncEngine = AnkiSyncEngine;
class AnkiSyncEngineDescriptor {
    constructor() {
        this.id = "a0138889-ff14-41e8-9466-42d960fe80d9";
        this.name = "anki";
        this.description = "Sync Engine for Anki";
    }
}
//# sourceMappingURL=AnkiSyncEngine.js.map