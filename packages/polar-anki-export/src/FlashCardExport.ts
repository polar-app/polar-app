
import { APKG } from 'polar-anki-apkg/src/index';
export namespace FlashCardExport {
    export async function init() {

        const apkg = new APKG('test');

        const models = apkg.addModels();

        function addBasicFlashcard () {
            apkg.addCard(models.BASIC_FRONT_BACK, {
                content: ["front example", "back example"]
            })
        }

        function addClozeFlashcard() {
            apkg.addCard(models.CLOZE, {
                content: ["front cloze"]
            });
        }

        addBasicFlashcard();

        addClozeFlashcard();

        await apkg.save(__dirname);
    };
}