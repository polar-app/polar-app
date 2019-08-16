import {DocMeta, IDocMeta} from '../../../../metadata/DocMeta';
import {IPageInfo, PageInfo} from '../../../../metadata/PageInfo';
import {Flashcard, IFlashcard} from '../../../../metadata/Flashcard';

export interface FlashcardDescriptor {

    readonly docMeta: IDocMeta;

    readonly pageInfo: IPageInfo;

    readonly flashcard: IFlashcard;
}
