const assert = require('assert');
const url = require('url');
const PagingState = require("./PagingState").PagingState;
const MockPagingBrowser = require("./MockPagingBrowser").MockPagingBrowser;

const {PagingLoader} = require('./PagingLoader');

describe('PagingLoader', function() {

    describe('Test paging', function() {

        it("requests finished first", async function () {

            let mockPagingBrowser = new MockPagingBrowser();

            let state = new PagingState({

                // the initial position after the page loads isn't scrolled.
                scrollPosition: {
                    x: 0,
                    y: 0,
                },
                scrollBox: {
                    width: 100,
                    height: 200,
                },
                viewportBox: {
                    width: 75,
                    height: 75,
                }

            });

            mockPagingBrowser.setState(state);

            let finished = false;

            let pagingLoader = new PagingLoader(mockPagingBrowser, function () {
                finished = true;
            });

            // *** pretend the first page is loaded

            assert.equal(pagingLoader.requestsFinished, true);
            pagingLoader.onPendingRequestsUpdate({pending: 1});
            assert.equal(pagingLoader.requestsFinished, false);
            pagingLoader.onPendingRequestsUpdate({pending: 0});
            assert.equal(pagingLoader.requestsFinished, true);

            // *** now start loading

            await pagingLoader.init();

            assert.equal(pagingLoader.finished, false);

            // move forward a page.
            assert.equal(await pagingLoader._nextPage(), true);

            assert.equal(pagingLoader.pageIdx, 1);
            assert.equal(pagingLoader.finished, false);

            assert.equal(await pagingLoader._nextPage(), true);
            assert.equal(pagingLoader.pageIdx, 2);
            assert.equal(pagingLoader.finished, false);


            assert.equal(await pagingLoader._nextPage(), false);
            assert.equal(pagingLoader.pageIdx, 2);
            assert.equal(pagingLoader.pagingFinished, true);

            pagingLoader._handleFinished();

            // ***
            assert.equal(pagingLoader.finished, true);

        });

        it("requests finished last", async function () {

            let mockPagingBrowser = new MockPagingBrowser();

            let state = new PagingState({

                // the initial position after the page loads isn't scrolled.
                scrollPosition: {
                    x: 0,
                    y: 0,
                },
                scrollBox: {
                    width: 100,
                    height: 200,
                },
                viewportBox: {
                    width: 75,
                    height: 75,
                }

            });

            mockPagingBrowser.setState(state);

            let finished = false;

            let pagingLoader = new PagingLoader(mockPagingBrowser, function () {
                finished = true;
            });

            // *** pretend the first page is loaded

            await pagingLoader.init();

            assert.equal(pagingLoader.requestsFinished, true);
            pagingLoader.onPendingRequestsUpdate({pending: 1});
            assert.equal(pagingLoader.requestsFinished, false);

            // *** now start loading

            assert.equal(await pagingLoader._nextPage(), true);
            assert.equal(pagingLoader.pageIdx, 1);
            assert.equal(pagingLoader.finished, false);

            assert.equal(await pagingLoader._nextPage(), true);
            assert.equal(pagingLoader.pageIdx, 2);
            assert.equal(pagingLoader.finished, false);


            assert.equal(await pagingLoader._nextPage(), false);
            assert.equal(pagingLoader.pageIdx, 2);
            assert.equal(pagingLoader.pagingFinished, true);

            // *** now finish the requests

            pagingLoader.onPendingRequestsUpdate({pending: 0});
            assert.equal(pagingLoader.requestsFinished, true);

            // ***
            assert.equal(pagingLoader.finished, true);

        });

    });

});
