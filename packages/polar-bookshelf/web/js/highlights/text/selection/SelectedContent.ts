/**
 * High level class representing the underlying selections without the
 * complexities and insanity of the selection API which is really rough to deal
 * with.
 */
import {RectText} from '../controller/RectText';

export class SelectedContent {

    /**
     * The text of the selected content.
     */
    public readonly text: string;

    /**
     * The html content of the selection.
     */
    public readonly html: string;

    /**
     * The html content of the selection.
     */
    public readonly rectTexts: RectText[] = [];

    constructor(obj: any) {

        this.html = obj.html;
        this.text = obj.text;
        this.rectTexts = obj.rectTexts;

    }

}
