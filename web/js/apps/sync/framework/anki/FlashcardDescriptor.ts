import {DocMeta} from '../../../../metadata/DocMeta';
import {PageInfo} from '../../../../metadata/PageInfo';
import {Flashcard} from '../../../../metadata/Flashcard';
import {IDocMeta} from "../../../../metadata/IDocMeta";
import {IPageInfo} from "../../../../metadata/IPageInfo";
import {IFlashcard} from "../../../../metadata/IFlashcard";

export interface FlashcardDescriptor {

    readonly docMeta: IDocMeta;

    readonly pageInfo: IPageInfo;

    readonly flashcard: IFlashcard;
}
