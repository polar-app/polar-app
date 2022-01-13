import { FlashCardExport } from './FlashCardExport';
import { existsSync, readFileSync} from 'fs';
import { join } from 'path';
import { assert } from 'chai';



describe("Flashcard export", () => {
    it("generates flashcard", async () => {
        const ankiExport = FlashCardExport.init("test-export");

        ankiExport.addBasic("front example", `<div>back example</div> <img src="FlashCardTestN.png" />`);

        ankiExport.addMedia('FlashCardTestN.png', readFileSync(join(__dirname, "FlashCardTestN.png")));

        ankiExport.addCloze("text {{c1::deletion}}");

        ankiExport.addFrontBackAndReverse("front and reverse", "back and reverse");
        
        ankiExport.addFrontBackOrReverse("Front or rev", "Back or rev", "Add reverse");

        await ankiExport.save(__dirname);

        assert.isTrue(existsSync(join(__dirname, "test-export.apkg")));
    });
});
