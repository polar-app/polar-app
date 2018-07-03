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

class Selections {

    /**
     * Get the ranges of a selection as an array (easier API).
     *
     * @param selection {Selection}
     * @return {Array<Range>}
     */
    static toRanges(selection) {

        let result = [];

        for (let idx = 0; idx < selection.rangeCount; idx++) {

            // note that we almost always have 1 selection
            let range = selection.getRangeAt(idx);
            result.push(range);

        }

        return result;
    }

    // I should test this by using something like:
    //
    // window.getSelection().getRangeAt(0).selectAllChildren(document.body);
    //
    // and then verifying the text ranges...

    /**
     * Compute the selection rects based on the page offset, not the
     * client/viewport offset.
     *
     * @param window {Window}
     * @return {SelectedContent}
     */
    static computeSelectionRects(win) {

        // FIXME: how do we determine the caret?

        // we use the following tricks to work with selections:

        // getClientsRects(): allows us to find the actual rects on the page which
        //                    include the data we need.
        //
        // window.scrollX : We use window.scrollX and scrollY to determine where
        //                  rect should be rendered relative document.body
        //
        // excluding cursor: if the width is < 1 we know it's the cursor.
        //
        // window.getSelection().toString(): gives us the full text of the
        // selection
        //
        //
        // FIXME: call selection.toString() so we can have the text to work with.

        // TODO: how do I find out that the current selection from just the cursor?

        // here is hte general algorithm I'm going to use.
        //
        // there should be a 1/1 pairing of the rects with the the elements.
        //
        // the cloned elements will have the text.  This way I can get the text
        // at each position.

        let selection = win.getSelection();

        let rectTexts = [];

        // one of the rects is the cursor.. how do we tell?

        // capture the text of the selection as some other APIs might clear
        // the selection on us.
        let text = selection.toString();

        let ranges = Selections.toRanges(selection);
        ranges = Ranges.cloneRanges(ranges);

        ranges.forEach(range => {

            // TODO: get the node/element that the range represents...

            let scrollPoint = new Point({
                x: window.scrollX,
                y: window.scrollY
            });

            let clientRects = Array.from(range.getClientRects());
            clientRects.forEach(clientRect => {
                let rect = new Rect(Objects.duplicate(clientRect));
                rect = Rects.validate(rect);
                rect = Rects.relativeTo(scrollPoint, rect);
                rectTexts.push(new RectText({rect}));

            });

        });

        return new SelectedContent({
            rectTexts,
            text
        })

        // now process all the clientRects to remove cursors...
        //clientRects = clientRects.filter( current => this.isCursor(current))

    }

    /**
     * Return true if this is the current cursor position.
     *
     * @param rect
     * @return {boolean}
     */
    static isCursor(rect) {
        return rect.width < 1;

    }


}

module.exports.Selections = Selections;

