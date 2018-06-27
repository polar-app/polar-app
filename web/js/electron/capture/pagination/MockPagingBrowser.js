/**
 * Simple paging browser for testing the PagingLoader
 */
const PagingBrowser = require("./PagingBrowser").PagingBrowser;

class MockPagingBrowser extends PagingBrowser {

    constructor() {
        super();
        this._scrollPosition = null;
        this._scrollBox = null;
    }

    async pageDown() {
        return super.pageDown();
    }

    async scrollPosition() {
        return this._scrollPosition;
    }

    async scrollBox() {
        return this._scrollBox;
    }

}

module.exports.MockPagingBrowser = MockPagingBrowser;
