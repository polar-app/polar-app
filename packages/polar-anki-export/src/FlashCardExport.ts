
import { APKG } from 'polar-anki-apkg/src/index';
import { readFileSync } from 'fs';
import { join } from 'path';
export namespace FlashCardExport {
    export async function init() {

        const apkg = new APKG('test');

        const models = apkg.addModels();

        function addBasicFlashcard () {
            apkg.addCard(models.BASIC_FRONT_BACK, {
                content: ["front example", `<div>back example</div><img src="ankimg.png">`]
            });

            apkg.addMedia("ankimg.png", readFileSync(join(__dirname, "ankimg.png")));
        }

        function addClozeFlashcard() {
            apkg.addCard(models.CLOZE, {
                content: ["text {{c1::test}}"]
            });
        }

        function addFrontBackAndReverse(){
            apkg.addCard(models.BASIC_FRONT_BACK_AND_REVERSE, {
                content: ["front and reverse", "back and reverse"]
            });
        }
        
        function addFrontBackOrReverse(){
            apkg.addCard(models.BASIC_FRONT_BACK_OR_REVERSE, {
                content: ["Front optional reverse", "back or reverse", "add reverse"]
            });
        }

        addBasicFlashcard();

        addClozeFlashcard();

        addFrontBackAndReverse();

        addFrontBackOrReverse();

        await apkg.save(__dirname);
    };
}