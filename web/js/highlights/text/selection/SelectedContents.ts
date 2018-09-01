/**
 *
 */
import {Ranges} from './Ranges';
import {SelectedContent} from './SelectedContent';
import {Selections} from './Selections';

const {TextNodeRows} = require("./TextNodeRows");
const {RectTexts} = require("../controller/RectTexts");
const sanitizeHtml = require("sanitize-html");

export class SelectedContents {

    /**
     * Compute the SelectedContents based on the page offset, not the
     * client/viewport offset, and include additional metadata including the
     * text of the selection, the html, etc.
     *
     * @param win {Window}
     * @return {SelectedContent}
     */
    static compute(win: Window) {

        let selection = win.getSelection();

        // get all the ranges and clone them so they can't vanish.
        let ranges = Ranges.cloneRanges(Selections.toRanges(selection));

        // now get the text and the sanitized HTML
        let text = selection.toString();
        let html = sanitizeHtml(SelectedContents.toHTML(ranges));

        let textNodes: Node[] = [];

        ranges.forEach(range => {
            textNodes.push(...Ranges.getTextNodes(range));
        });

        // FIXME: we're getting FEWER results.. not mroe.. that's a bug..

        // convert textNodes to visual blocks that don't overlap ...
        // FIXME: this is the problem.. we're splitting the first node and then it's
        // only a partial node at that point.. we have to keep the children too
        // and return it as some sort of container.

        textNodes = TextNodeRows.fromTextNodes(textNodes);

        let rectTexts = RectTexts.toRectTexts(textNodes);

        return new SelectedContent({
            text,
            html,
            rectTexts
        })

    }

    /**
     * Compute the given ranges as HTML, factoring in sanitization as well.
     * @param ranges
     */
    static toHTML(ranges: Range[]) {
        return ranges.map(range => Ranges.toHTML(range)).join("");
    }

}
