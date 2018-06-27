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
     * @Override
     * @return {Promise<null|*>}
     */
    async state() {
        return this._state;
    }

    async scrollToPosition(scrollPosition) {

        let state = await this.state();

        // don't mutate the existing state by side effect
        state = Objects.duplicate(state);

        state.scrollPosition = scrollPosition;
        this.setState(state);

    }

}

module.exports.MockPagingBrowser = MockPagingBrowser;
