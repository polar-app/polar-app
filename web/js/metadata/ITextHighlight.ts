import {ITextRect, TextRect} from "./TextRect";
import {Text} from "./Text";
import {Rect} from "../Rect";
import {INote} from "./INote";
import {IQuestion} from "./IQuestion";
import {IFlashcard} from "./IFlashcard";
import {IAnnotation} from "./IAnnotation";
import {HighlightColor} from "./IBaseHighlight";
import {IImage} from "./IImage";

export interface ITextHighlight extends IAnnotation {

    readonly textSelections: { [id: number]: ITextRect };

    readonly text: Text | string;

    /**
     * User edited/revised text for the highlight.
     */
    readonly revisedText?: Text | string;

    readonly rects: { [key: number]: Rect };
    readonly image?: IImage;
    readonly images: { [key: string]: IImage };
    readonly notes: { [key: string]: INote };
    readonly questions: { [key: string]: IQuestion };
    readonly flashcards: { [key: string]: IFlashcard };
    readonly color?: HighlightColor;

}
