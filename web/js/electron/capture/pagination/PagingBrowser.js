/**
 * A browser that implements paging of the UI.
 */
class PagingBrowser {

    /**
     * Trigger the browser window to page down.
     */
    async pageDown() {

    }

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
     *  - document.body.scrollWidth
     *  - document.body.scrollHeight
     *
     *  viewportBox:
     *
     * The size of the viewport in width and height.
     *
     * This corresponds to:
     *
     * - window.innerWidth
     * - window.innerHeight
     *
     * @return {Promise<PaginationState>}
     */
    async state() {

    }

    /**
     * Factor in the current scrollPosition, scrollBox, and viewportBox to determine
     * the percentage of the page that is scrolled for the width and height
     * dimensions.
     *
     * @return {Promise<Object>}
     */
    async visualScrollPercentage() {

        let state = await this.state();

        return {
            width: 100 * (Math.ceil(state.scrollPosition.x + state.viewportBox.width) / state.scrollBox.width),
            height: 100 * (Math.ceil(state.scrollPosition.y + state.viewportBox.height) / state.scrollBox.height)
        };

    }

}

module.exports.PagingBrowser = PagingBrowser;
