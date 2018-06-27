/**
 * A browser that implements paging of the UI.
 */
const Point = require("./Point").Point;

class PagingBrowser {


    /**
     * Get the current state of the page. This is called as an atomic method
     * to prevent the page reloading and resizing between calculating various
     * fields.
     *
     * We return a dict with the following properties:
     *
     * scrollPosition:
     *
     * The scroll position as a point (x,y)
     *
     * This corresponds to:
     *
     *  x: window.scrollX
     *  y: window.scrollY
     *
     * scrollBox:
     *
     * Get the scroll box size in width and height.
     *
     * This corresponds to:
     *
     *  width: document.body.scrollWidth
     *  height: document.body.scrollHeight
     *
     *  viewportBox:
     *
     * The size of the viewport in width and height.
     *
     * This corresponds to:
     *
     * width: window.innerWidth
     * height: window.innerHeight
     *
     * @return {Promise<PagingState>}
     */
    async state() {
        throw new Error("not implemented");
    }

    /**
     * Tell the browser to scroll to the given scroll position
     * @param scrollPosition {Point}
     * @return {Promise<void>}
     */
    async scrollToPosition(scrollPosition) {
        throw new Error("not implemented");
    }

    /**
     * Trigger the browser window to page down.
     *
     * @return {Promise<void>}
     */
    async pageDown() {

        let state = await this.state();

        let newScrollPosition = this.computePageDownScrollPosition(state);

        return this.scrollToPosition(newScrollPosition);

    }

    /**
     * Return true if the browser window is fully paginated or we have a
     * document which is now too long when compared to the initial scroll
     * height.
     *
     * @return {boolean}
     */
    fullyPaginated(state) {
        let visualScrollPercentage = this.visualScrollPercentage(state);
        return visualScrollPercentage.height >= 100;
    }

    /**
     * Compute the next scroll position as if the user was paging down.
     *
     * @return {Point}
     */
    computePageDownScrollPosition(state) {

        let maxScrollPositions = this.computeMaxScrollPositions(state);

        return new Point({
            // x is always zero as we are not scrolling horizontally for now.
            x: 0,

            y: Math.min(state.scrollPosition.y + (state.viewportBox.height * 0.9), maxScrollPositions.y)
        });

    }

    /**
     *
     * @param state {PagingState}
     * @return {Point}
     */
    computeMaxScrollPositions(state) {

        return {
            x: state.scrollBox.width - state.viewportBox.width,
            y: state.scrollBox.height - state.viewportBox.height
        };

    }

    /**
     * Factor in the current scrollPosition, scrollBox, and viewportBox to determine
     * the percentage of the page that is scrolled for the width and height
     * dimensions.
     *
     * @param state {PagingState}
     * @return {BasicBox}
     */
    visualScrollPercentage(state) {

        return {
            width: PagingBrowser.perc(state.scrollPosition.x + state.viewportBox.width, state.scrollBox.width),
            height: PagingBrowser.perc(state.scrollPosition.y + state.viewportBox.height, state.scrollBox.height)
        };

    }

    /**
     * Percentage with upper bound of 100.
     */
    static perc(n, d) {
        return Math.min(100 * (Math.ceil(n) / d), 100);
    }

}

module.exports.PagingBrowser = PagingBrowser;
