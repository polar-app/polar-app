/**
 *
 */
import {Rect} from '../../../Rect';

export interface RectText {

    readonly selectionRange: DOMRect;
    readonly text: string | undefined;
    // readonly clientRects: Rect;
    readonly boundingClientRect: Rect;
    readonly boundingPageRect: Rect;

}
