/**
 * Simple paging browser for testing the PagingLoader
 */
const PagingBrowser = require("./PagingBrowser").PagingBrowser;
const {Objects} = require("../../../util/Objects");

class MockPagingBrowser extends PagingBrowser {

    constructor() {
        super();
        this._state = null;
    }

    setState(state) {
        this._state = state;
    }

    /**
     * Trigger the browser window to page down.
     * @Override
     * @return {Promise<void>}
     */
    async pageDown() {

        let state = await this.state();

        // don't mutate the existing state by side effect
        state = Objects.duplicate(state);

        let pageDownScrollPosition = this.computePageDownScrollPosition(state);

        state.scrollPosition.y = pageDownScrollPosition.y;

        this.setState(state);

    }

    /**
     * @Override
     * @return {Promise<null|*>}
     */
    async state() {
        return this._state;
    }

}

module.exports.MockPagingBrowser = MockPagingBrowser;
