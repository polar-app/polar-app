import {Rect} from '../../../Rect';
import {RectText} from './RectText';
import {TextNodes} from '../selection/TextNodes';

export class RectTexts {

    public static toRectTexts(textNodes: ReadonlyArray<Node>): ReadonlyArray<RectText> {

        function predicate(current: RectText) {
            return current.boundingClientRect.width > 0 && current.boundingClientRect.height > 0;
        }

        return textNodes.map(RectTexts.toRectText)
                        .filter(predicate);
    }

    /**
     * Take a Node of type TEXT and build a RectText including the the text,
     * the rects, etc.
     */
    public static toRectText(textNode: Node): RectText {

        const range = TextNodes.getRange(textNode);

        const win = textNode.ownerDocument!.defaultView!;

        const selectionRange = win.getSelection()!.getRangeAt(0).getBoundingClientRect();

        const boundingClientRect = new Rect(range.getBoundingClientRect());

        return {
            // clientRects: range.getClientRects(),
            selectionRange,
            boundingClientRect,
            text: textNode.textContent || ''
        };

    }

}
