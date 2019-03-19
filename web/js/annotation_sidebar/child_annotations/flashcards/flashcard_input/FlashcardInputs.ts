import {HTMLStr} from '../../../../util/Strings';
import {Flashcard} from '../../../../metadata/Flashcard';

export type FlashcardInputFieldsType = FrontAndBackFields | ClozeFields;

export interface ClozeFields {
    text: HTMLStr;
}

export interface FrontAndBackFields {
    front: HTMLStr;
    back: HTMLStr;
}

export class FlashcardInputs {

    public static fieldToString(name: string, existingFlashcard?: Flashcard): string {

        if (existingFlashcard) {

            if (existingFlashcard.fields[name] && existingFlashcard.fields[name].HTML) {
                return existingFlashcard.fields[name].HTML!;
            }

        }

        return "";

    }

}


