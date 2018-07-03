/**
 *
 */
const {Ranges} = require("./Ranges");
const {RectText} = require("../controller/RectText");
const {Point} = require("../../../Point");
const {Rect} = require("../controller/Rect");
const {Rects} = require("../../../Rects");
const {Objects} = require("../../../util/Objects");
const {SelectedContent} = require("./SelectedContent");
const sanitizeHtml = require("sanitize-html");

class SelectedContents {

    /**
     * Compute the SelectedContents based on the page offset, not the
     * client/viewport offset, and include additional metadata including the
     * text of the selection, the html, etc.
     *
     *
     *
     * @param win {Window}
     * @return {SelectedContent}
     */
    static compute(win) {

        let selection = win.getSelection();

        // get all the ranges.
        let ranges = Selections.toRanges(selection);

        // now clone them so they can't go away
        ranges = Ranges.cloneRanges(ranges);

        let textNodes = [];

        ranges.forEach(range => {
            textNodes.push(...Ranges.getTextNodes(range));
        });

        let rectTexts = RectTexts.toRectTexts(textNodes);

        let text = selection.toString();

        let html = SelectedContents.toHTML(ranges);
        html = sanitizeHtml(html);

        return new SelectedContent({
            rectTexts,
            text,
            html
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

