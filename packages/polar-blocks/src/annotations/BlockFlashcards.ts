import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {MarkdownStr} from "polar-shared/src/util/Strings";
import {IBlockClozeFlashcard, IBlockFlashcard, IBlockFrontBackFlashcard} from "./IBlockFlashcard";

export namespace BlockFlashcards {
    export const CLOZE_ARCHETYPE = "76152976-d7ae-4348-9571-d65e48050c3f";
    export const FRONT_BACK_ARCHETYPE = "9d146db1-7c31-4bcf-866b-7b485c4e50ea";

    /**
     * Create a cloze deletion flashcard.
     *
     * @param text The markdown text contents of the flashcard.
     *
     * @return {IBlockClozeFlashcard}
     */
    export function createCloze(text: MarkdownStr): IBlockClozeFlashcard {
        return {
            type: FlashcardType.CLOZE,
            fields: { text },
            archetype: CLOZE_ARCHETYPE,
        };
    }

    /**
     * Create a front/back flashcard.
     *
     * @param front The markdown text contents of the front area of the flashcard.
     * @param back The markdown text contents of the back area of the flashcard.
     *
     * @return {IBlockFrontBackFlashcard}
     */
    export function createFrontBack(front: MarkdownStr, back: MarkdownStr): IBlockFrontBackFlashcard {
        return {
            type: FlashcardType.BASIC_FRONT_BACK,
            fields: { front, back },
            archetype: FRONT_BACK_ARCHETYPE,
        };
    }

    /**
     * Update a specific text field within a flashcard.
     *
     * @template {IBlockFlashcard} T - T must be a flashcard object.
     * @param flashcard A flashcard object.
     * @param field The name of the field to be updated.
     * @param value The new contents of the field.
     *
     * @returns {T}
     */
    export function updateField<T extends IBlockFlashcard>(flashcard: T, field: keyof T['fields'], value: MarkdownStr): T {
        return {
            ...flashcard,
            fields: { ...flashcard.fields, [field]: value },
        };
    }
}
