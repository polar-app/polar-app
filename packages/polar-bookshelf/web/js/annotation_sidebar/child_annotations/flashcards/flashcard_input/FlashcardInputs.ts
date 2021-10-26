import {Flashcard} from 'polar-shared/src/metadata/Flashcard';
import {HTMLStr} from "polar-shared/src/util/Strings";

export type FlashcardInputFieldsType = FrontAndBackFields | ClozeFields;

export interface ClozeFields {
    readonly text: HTMLStr;
}

export interface FrontAndBackFields {
    readonly front: HTMLStr;
    readonly back: HTMLStr;
}

export class FlashcardInputs {

    public static fieldToString(name: string,
                                existingFlashcard: Flashcard | undefined,
                                defaultValue?: string): string {

        if (existingFlashcard) {

            if (existingFlashcard.fields[name] && existingFlashcard.fields[name].HTML) {
                return existingFlashcard.fields[name].HTML!;
            }

        }

        return defaultValue || "";

    }

}


