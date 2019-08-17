import {IRect} from 'polar-shared/src/util/rects/IRect';

export interface ITextRect {

    /**
     * The actual text in this rect.
     */
    readonly text: string;

    /**
     * A rect area that the user has selected text.
     */
    readonly rect: IRect;

}
