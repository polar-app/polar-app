import {Point} from '../../../Point';
import {Rect} from '../../../Rect';
import {Rects} from '../../../Rects';
import {RectText} from './RectText';
import {TextNodes} from '../selection/TextNodes';
import {Objects} from "polar-shared/src/util/Objects";

export class RectTexts {

    /**
     *
     * @param textNodes
     */
    public static toRectTexts(textNodes: ReadonlyArray<Node>) {

        function predicate(current: RectText) {
            return current.boundingPageRect.width > 0 && current.boundingPageRect.height > 0;
        }

        return textNodes.map(RectTexts.toRectText)
                        .filter(predicate);
    }

    /**
     * Take a Node of type TEXT and build a RectText including the the text,
     * the rects, etc.
     *
     * @param textNode {Node}
     * @return {RectText}
     */
    public static toRectText(textNode: Node): RectText {

        // FIXME: the issue is that this range is completely wrong for some
        // fucking reason.

        // FIXME the issue here is that there are a LOT of text nodes here... not
        // just one.

        // FIXME: log.warn this if the result comes back wrong.
        const range = TextNodes.getRange(textNode);

        const win = textNode.ownerDocument!.defaultView!;
        const doc = win.document;

        const scrollPoint = new Point({
            x: win.scrollX,
            y: win.scrollY
        });

        // const scrollPoint = new Point({
        //     x: -21,
        //     y: -98
        // });

        const selectionRange = win.getSelection()!.getRangeAt(0).getBoundingClientRect();

        const boundingClientRect = new Rect(range.getBoundingClientRect());

        let boundingPageRect = Rects.validate(boundingClientRect);

        boundingPageRect = Rects.relativeTo(scrollPoint, boundingPageRect);

        return {
            // clientRects: range.getClientRects(),
            selectionRange,
            boundingClientRect,
            boundingPageRect,
            text: textNode.textContent || undefined
        };

    }

}
