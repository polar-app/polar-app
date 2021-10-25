import {Rect} from 'polar-shared/src/util/Rect';

export interface RectText {

    readonly selectionRange: DOMRect;
    readonly text: string;
    readonly boundingClientRect: Rect;
    // readonly boundingPageRect: Rect;
}

