import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {IBlockClozeFlashcard, IBlockFlashcard, IBlockFrontBackFlashcard} from "./IBlockFlashcard";

export namespace BlockFlashcards {
    export const CLOZE_ARCHETYPE = "76152976-d7ae-4348-9571-d65e48050c3f";
    export const FRONT_BACK_ARCHETYPE = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";

    export function createCloze(text: MarkdownStr): IBlockClozeFlashcard {
        return {
            type: FlashcardType.CLOZE,
            fields: { text },
            archetype: CLOZE_ARCHETYPE,
        };
    }

    export function createFrontBack(front: MarkdownStr, back: MarkdownStr): IBlockFrontBackFlashcard {
        return {
            type: FlashcardType.BASIC_FRONT_BACK,
            fields: { front, back },
            archetype: FRONT_BACK_ARCHETYPE,
        };
    }

    export function updateField<T extends IBlockFlashcard>(flashcard: T, field: keyof T['fields'], value: string): T {
        return {
            ...flashcard,
            fields: { ...flashcard.fields, [field]: value },
        };
    }
}
