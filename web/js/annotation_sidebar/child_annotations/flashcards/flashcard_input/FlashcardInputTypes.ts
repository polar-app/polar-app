import {HTMLStr} from '../../../../util/Strings';

export type FlashcardInputFieldsType = FrontAndBackFields | ClozeFields;

export interface ClozeFields {
    text: HTMLStr;
}

export interface FrontAndBackFields {
    front: HTMLStr;
    back: HTMLStr;
}



