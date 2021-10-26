import {FlashcardType} from "./FlashcardType";
import {Text} from "./Text";
import {IAnnotation} from "./IAnnotation";

export interface IFlashcard extends IAnnotation {

    /**
     * The type of this flashcard.
     */
    readonly type: FlashcardType;

    /**
     * The content of this flashcard created by the user.
     */
    readonly fields: { readonly [key: string]: Text };

    /**
     * The archetype ID used to create this flashcard.
     */
    readonly archetype: string;

}
