import {IXYRect} from './IXYRect';

export class IXYRects {

    static createFromClientRect(clientRect: ClientRect): IXYRect {

        return {
            x: clientRect.left,
            y: clientRect.top,
            width: clientRect.width,
            height: clientRect.height
        }

    }

}
