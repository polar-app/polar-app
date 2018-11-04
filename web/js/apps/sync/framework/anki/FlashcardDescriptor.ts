import {DocMeta} from '../../../../metadata/DocMeta';
import {PageInfo} from '../../../../metadata/PageInfo';
import {Flashcard} from '../../../../metadata/Flashcard';

export interface FlashcardDescriptor {

    readonly docMeta: DocMeta;

    readonly pageInfo: PageInfo;

    readonly flashcard: Flashcard;
}
