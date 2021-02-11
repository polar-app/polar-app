/**
 * High level class representing the underlying selections without the
 * complexities and insanity of the selection API which is really rough to deal
 * with.
 */
import {RectText} from '../controller/RectText';

export interface ISelectedContent {

    /**
     * The text of the selected content.
     *
     */
    readonly text: string;

    /**
     * The html content of the selection.
     */
    readonly html: string;

    /**
     * The text content of the selection.
     */
    readonly rectTexts: ReadonlyArray<RectText>;

    /**
     * A position in the document to represent the sort order.
     */
    readonly order: number | undefined;

}
