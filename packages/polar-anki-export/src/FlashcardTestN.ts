import { FlashcardExport } from './FlashcardExport';
import { existsSync, readFileSync} from 'fs';
import { join } from 'path';
import { assert } from 'chai';



describe("Flashcard export", () => {
    it("generates flashcard", async () => {
        const ankiExport = FlashcardExport.create("test-export");

        ankiExport.addBasic("front example", `<div>back example</div> <img src="FlashcardTestN.png" />`);

        ankiExport.addMedia('FlashcardTestN.png', readFileSync(join(__dirname, "FlashcardTestN.png")));

        ankiExport.addCloze("text {{c1::deletion}}");

        ankiExport.addFrontBackAndReverse("front and reverse", "back and reverse");
        
        ankiExport.addFrontBackOrReverse("Front or rev", "Back or rev", "Add reverse");

        await ankiExport.save(__dirname);

        assert.isTrue(existsSync(join(__dirname, "test-export.apkg")));
    });
});
