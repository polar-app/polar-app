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

    static instanceOf(val: any): val is IXYRect {

        return val.x !== undefined &&
            val.y !== undefined &&
            val.width !== undefined &&
            val.height !== undefined;

    }

}
