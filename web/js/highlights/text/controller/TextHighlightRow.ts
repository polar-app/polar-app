/**
 * Represents a row of highlighted text including the rect around it, and the
 * elements it contains.
 */
import {RectElement} from './RectElement';

export class TextHighlightRow {

    public readonly rect: any;

    public readonly rectElements: RectElement[];

    constructor(rect: any, rectElements: RectElement[]) {
        this.rect = rect;
        this.rectElements = rectElements;
    }

}
