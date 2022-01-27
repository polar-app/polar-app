
import { APKG } from 'polar-anki-apkg/src/APKG';
export namespace FlashcardExport {
    export function init(fileName: string) {

        const apkg = APKG.init(fileName);

        const models = apkg.addModels();

        function addBasic (front: string, back: string): void {
            apkg.addCard(models.BASIC_FRONT_BACK, {
                content: [front, back]
            });

        }

        function addCloze(text: string): void {
            apkg.addCard(models.CLOZE, {
                content: [text]
            });
        }

        function addFrontBackAndReverse(front: string, back: string): void {
            apkg.addCard(models.BASIC_FRONT_BACK_AND_REVERSE, {
                content: [front, back]
            });
        }
        
        function addFrontBackOrReverse(front: string, back: string,
                                       addReverse: string): void {

            apkg.addCard(models.BASIC_FRONT_BACK_OR_REVERSE, {
                content: [front, back, addReverse]
            });
        }

        return {
            addBasic,
            addCloze,
            addFrontBackAndReverse,
            addFrontBackOrReverse,
            addMedia: apkg.addMedia,
            save: apkg.save
        }
    };
}