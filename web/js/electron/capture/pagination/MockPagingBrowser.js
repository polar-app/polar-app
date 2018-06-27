/**
 * Simple paging browser for testing the PagingLoader
 */
const PagingBrowser = require("./PagingBrowser").PagingBrowser;

class MockPagingBrowser extends PagingBrowser {

    constructor() {
        super();
        this._state = null;
    }

    setState(state) {
        this._state = state;
    }

    async state() {
        return this._state;
    }

}

module.exports.MockPagingBrowser = MockPagingBrowser;
