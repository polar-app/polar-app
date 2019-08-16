import {DocMeta} from '../../../../metadata/DocMeta';
import {PageInfo} from '../../../../metadata/PageInfo';
import {Flashcard, IFlashcard} from '../../../../metadata/Flashcard';
import {IDocMeta} from "../../../../metadata/IDocMeta";
import {IPageInfo} from "../../../../metadata/IPageInfo";

export interface FlashcardDescriptor {

    readonly docMeta: IDocMeta;

    readonly pageInfo: IPageInfo;

    readonly flashcard: IFlashcard;
}
