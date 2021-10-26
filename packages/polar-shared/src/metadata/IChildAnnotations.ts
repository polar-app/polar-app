import {INote} from "./INote";
import {IQuestion} from "./IQuestion";
import {IFlashcard} from "./IFlashcard";

/**
 * An object that supports child annotations like notes, questions, and flashcards.
 */
export interface IChildAnnotations {

    readonly notes: { readonly [key: string]: INote };
    readonly questions: { readonly [key: string]: IQuestion };
    readonly flashcards: { readonly [key: string]: IFlashcard };

}
