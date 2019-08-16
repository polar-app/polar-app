import {BaseHighlight} from './BaseHighlight';
import {Rect} from '../Rect';
import {IImage, Image} from './Image';
import {Note} from './Note';
import {IQuestion, Question} from './Question';
import {Flashcard, IFlashcard} from './Flashcard';
import {ISODateTimeString} from './ISODateTimeStrings';
import {Author} from './Author';
import {HighlightColor} from './HighlightColor';
import {IBaseHighlight} from "./IBaseHighlight";
import {INote} from "./INote";

export class AreaHighlight extends BaseHighlight implements IAreaHighlight {

    constructor(val: any) {

        super(val);

        this.init(val);

    }

}

export interface IAreaHighlight extends IBaseHighlight {

    readonly rects: {[key: number]: Rect};
    readonly image?: IImage;
    readonly images: {[key: string]: IImage};
    readonly notes: {[key: string]: INote};
    readonly questions: {[key: string]: IQuestion};
    readonly flashcards: {[key: string]: IFlashcard};
    readonly id: string;
    readonly guid: string;
    readonly created: ISODateTimeString;
    readonly lastUpdated: ISODateTimeString;
    readonly author?: Author;
    readonly color?: HighlightColor;

}
