
import { APKG } from 'polar-anki-apkg/src/APKG';
export namespace FlashcardExport {
    export interface IFlashcardExport {
        addBasic: (front: string, back: string) => void;
        addCloze: (text: string) => void;
        addFrontBackAndReverse: (front: string, back: string) => void;
        addFrontBackOrReverse: (front: string, back: string, addReverse: string) => void;
        addMedia: (filename: string, data: Buffer) => void;
        save: (destination: string) => Promise<string>;
    }

    export function create(fileName: string): IFlashcardExport {

        const apkg = APKG.create(fileName);

        const models = apkg.addModels();

        function addBasic(front: string, back: string): void {
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