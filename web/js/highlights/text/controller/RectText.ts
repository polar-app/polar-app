/**
 *
 */
import {Rect} from '../../../Rect';

export class RectText {

    public readonly text: string;
    public readonly clientRects: Rect;
    public readonly boundingClientRect: Rect;
    public readonly boundingPageRect: Rect;

    constructor(obj: any) {

        this.text = obj.text;
        this.clientRects = obj.clientRects;
        this.boundingClientRect = obj.boundingClientRect;
        this.boundingPageRect = obj.boundingPageRect;

    }

}
