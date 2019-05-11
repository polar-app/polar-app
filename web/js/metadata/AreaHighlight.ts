import {BaseHighlight} from './BaseHighlight';
import {Rect} from '../Rect';
import {Image} from './Image';
import {Note} from './Note';
import {Question} from './Question';
import {Flashcard} from './Flashcard';
import {ISODateTimeString} from './ISODateTimeStrings';
import {Author} from './Author';
import {HighlightColor} from './HighlightColor';

export class AreaHighlight extends BaseHighlight implements IAreaHighlight {

    constructor(val: any) {

        super(val);

        this.init(val);

    }

}

export interface IAreaHighlight {

    readonly rects: {[key: number]: Rect};
    readonly image?: Image;
    readonly images: {[key: string]: Image};
    readonly notes: {[key: string]: Note};
    readonly questions: {[key: string]: Question};
    readonly flashcards: {[key: string]: Flashcard};
    readonly id: string;
    readonly guid: string;
    readonly created: ISODateTimeString;
    readonly lastUpdated: ISODateTimeString;
    readonly author?: Author;
    readonly color?: HighlightColor;

}
