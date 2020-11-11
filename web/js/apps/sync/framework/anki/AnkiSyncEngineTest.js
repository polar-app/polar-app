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
const AnkiSyncEngine_1 = require("./AnkiSyncEngine");
const Texts_1 = require("polar-shared/src/metadata/Texts");
const TextType_1 = require("polar-shared/src/metadata/TextType");
const Flashcards_1 = require("../../../../metadata/Flashcards");
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const DocMetas_1 = require("../../../../metadata/DocMetas");
xdescribe('AnkiSyncEngine', function () {
    function createMockFlashcard() {
        const text = Texts_1.Texts.create("This is the {{c1::cloze deletion}} text", TextType_1.TextType.MARKDOWN);
        const fields = { text };
        const archetype = "76152976-d7ae-4348-9571-d65e48050c3f";
        return Flashcards_1.Flashcards.create(FlashcardType_1.FlashcardType.CLOZE, fields, archetype, 'page:1');
    }
    function createMockDocMeta() {
        const docMeta = DocMetas_1.MockDocMetas.createMockDocMeta();
        const flashcard = createMockFlashcard();
        const pageMeta = DocMetas_1.DocMetas.getPageMeta(docMeta, 1);
        pageMeta.flashcards[flashcard.id] = flashcard;
        return docMeta;
    }
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const ankiSyncEngine = new AnkiSyncEngine_1.AnkiSyncEngine();
            const docMeta = createMockDocMeta();
            const job = yield ankiSyncEngine.sync([() => __awaiter(this, void 0, void 0, function* () { return docMeta; })], () => console.log("got sync event"));
            yield job.start();
        });
    });
});
//# sourceMappingURL=AnkiSyncEngineTest.js.map