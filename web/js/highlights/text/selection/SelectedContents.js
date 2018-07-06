/**
 *
 */
const {Ranges} = require("./Ranges");
const {SelectedContent} = require("./SelectedContent");
const {TextNodeRows} = require("./TextNodeRows");
const {Selections} = require("./Selections");
const {RectTexts} = require("../controller/RectTexts");
const sanitizeHtml = require("sanitize-html");

class SelectedContents {

    /**
     * Compute the SelectedContents based on the page offset, not the
     * client/viewport offset, and include additional metadata including the
     * text of the selection, the html, etc.
     *
     * @param win {Window}
     * @return {SelectedContent}
     */
    static compute(win) {

        let selection = win.getSelection();

        // get all the ranges and clone them so they can't vanish.
        let ranges = Ranges.cloneRanges(Selections.toRanges(selection));

        // now get the text and the sanitized HTML
        let text = selection.toString();
        let html = sanitizeHtml(SelectedContents.toHTML(ranges));

        let textNodes = [];

        ranges.forEach(range => {
            textNodes.push(...Ranges.getTextNodes(range));
        });

        // FIXME: we're getting FEWER results.. not mroe.. that's a bug..

        // convert textNodes to visual blocks that don't overlap ...
        // FIXME: this is the problem.. we're splitting the first node and then it's
        // only a partial node at that point.. we have to keep the children too
        // and return it as some sort of container.

        textNodes = TextNodeRows.fromTextNodes(textNodes);

        console.log("FIXME XX: working with N now: " + textNodes.length )

        let rectTexts = RectTexts.toRectTexts(textNodes);

        console.log("FIXME 11233: working with N rectTexts: " + rectTexts.length )

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
    static toHTML(ranges) {
        return ranges.map(range => Ranges.toHTML(range)).join("");
    }

}

module.exports.SelectedContents = SelectedContents;

