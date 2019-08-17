import {HighlightColor, IBaseHighlight} from "./IBaseHighlight";
import {INote} from "./INote";
import {IQuestion} from "./IQuestion";
import {IFlashcard} from "./IFlashcard";
import {ISODateTimeString} from "./ISODateTimeStrings";
import {IImage} from "./IImage";
import {IAuthor} from "./IAuthor";
import {IRect} from 'polar-shared/src/util/rects/IRect';

export interface IAreaHighlight extends IBaseHighlight {

    readonly rects: { [key: number]: IRect };
    readonly image?: IImage;
    readonly images: { [key: string]: IImage };
    readonly notes: { [key: string]: INote };
    readonly questions: { [key: string]: IQuestion };
    readonly flashcards: { [key: string]: IFlashcard };
    readonly id: string;
    readonly guid: string;
    readonly created: ISODateTimeString;
    readonly lastUpdated: ISODateTimeString;
    readonly author?: IAuthor;
    readonly color?: HighlightColor;

}
