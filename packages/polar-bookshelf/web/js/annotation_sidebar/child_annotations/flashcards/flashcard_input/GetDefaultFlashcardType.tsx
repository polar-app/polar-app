import {FlashcardType} from "polar-shared/src/metadata/FlashcardType";

export const getDefaultFlashcardType = () => {
    const defaultFlashcardType = window.localStorage.getItem('default-flashcard-type');

    switch (defaultFlashcardType) {

        case FlashcardType.BASIC_FRONT_BACK:
            return FlashcardType.BASIC_FRONT_BACK;

        case FlashcardType.CLOZE:
            return FlashcardType.CLOZE;

        default:
            return FlashcardType.BASIC_FRONT_BACK;
    }
};
