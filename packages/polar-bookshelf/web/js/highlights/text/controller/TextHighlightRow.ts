/**
 * Represents a row of highlighted text including the rect around it, and the
 * elements it contains.
 */
import {RectElement} from './RectElement';
import {Rect} from '../../../Rect';

export class TextHighlightRow {

    public readonly rect: Rect;

    public readonly rectElements: RectElement[];

    constructor(rect: any, rectElements: RectElement[]) {
        this.rect = rect;
        this.rectElements = rectElements;
    }

}
