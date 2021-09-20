import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";
import {MarkdownStr} from "polar-shared/src/util/Strings";

export interface IBlockFlashcardBase {

    /**
     * The archetype ID used to create this flashcard.
     */
    readonly archetype: string;
}


export interface IBlockFrontBackFlashcard extends IBlockFlashcardBase {

    /**
     * The type of this flashcard.
     */
    readonly type: FlashcardType.BASIC_FRONT_BACK
                   | FlashcardType.BASIC_FRONT_BACK_OR_REVERSE
                   | FlashcardType.BASIC_FRONT_BACK_AND_REVERSE;

    /**
     * The content of this flashcard created by the user.
     */
    readonly fields: Record<'front' | 'back', MarkdownStr>;

}

export interface IBlockClozeFlashcard extends IBlockFlashcardBase {

    /**
     * The type of this flashcard.
     */
    readonly type: FlashcardType.CLOZE;

    /**
     * The content of this flashcard created by the user.
     */
    readonly fields: Record<'text', MarkdownStr>;

}

export type IBlockFlashcard = IBlockFrontBackFlashcard | IBlockClozeFlashcard;
