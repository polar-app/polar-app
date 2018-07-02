/**
 *
 */
class Selections {

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
     * @return {Array<DomRect>}
     */
    static computeSelectionRects(win) {

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

        let selection = win.getSelection();

        let clientRects = [];
        let clonedElements = [];

        // one of the rects is the cursor.. how do we tell?

        for (let idx = 0; idx < selection.rangeCount; idx++) {

            // note that we almost always have 1 selection
            let range = selection.getRangeAt(idx);

            // TODO: get the node/element that the range represents...

            clientRects.push(...range.getClientRects());
            clonedElements.push(...range.cloneContents().querySelectorAll("*"));

        }

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
