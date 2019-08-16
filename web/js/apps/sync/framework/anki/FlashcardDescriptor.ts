import {DocMeta} from '../../../../metadata/DocMeta';
import {IPageInfo, PageInfo} from '../../../../metadata/PageInfo';
import {Flashcard, IFlashcard} from '../../../../metadata/Flashcard';
import {IDocMeta} from "../../../../metadata/IDocMeta";

export interface FlashcardDescriptor {

    readonly docMeta: IDocMeta;

    readonly pageInfo: IPageInfo;

    readonly flashcard: IFlashcard;
}
