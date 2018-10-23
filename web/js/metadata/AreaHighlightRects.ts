import {Rect} from "../Rect";
import {AreaHighlightRect} from "./AreaHighlightRect";

export class AreaHighlightRects {

    static createFromRect(rect: Rect) {

        return new AreaHighlightRect({
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        });

    }

}
