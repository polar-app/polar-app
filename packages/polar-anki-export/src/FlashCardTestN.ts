import { Template } from 'polar-anki-apkg/src/DeckConfig';
import { DeckConfig } from 'polar-anki-apkg/src/DeckConfig';
import { APKG } from 'polar-anki-apkg/src/index'
import { FlashCardExport } from './FlashCardExport';

describe("Flashcard export", () => {
    it("generates flashcard", async () => {
        await FlashCardExport.init();
    })
});
