
const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');
const Assertions = require("../../../test/Assertions");
const PagingState = require("./PagingState").PagingState;
const MockPagingBrowser = require("./MockPagingBrowser").MockPagingBrowser;

const {PagingBrowser} = require('./PagingBrowser');

describe('PagingBrowser', function() {

    describe('basic functionality', function() {

        it("basic", async function () {

            let mockPagingBrowser = new MockPagingBrowser();

            let state = new PagingState({

                // the initial position after the page loads isn't scrolled.
                scrollPosition: {
                    x: 0,
                    y: 0,
                },
                scrollBox: {
                    width: 100,
                    height: 1000,
                },
                viewportBox: {
                    width: 100,
                    height: 100,
                }

            });

            let visualScrollPercentage = mockPagingBrowser.visualScrollPercentage(state)

            Assertions.assertJSON(visualScrollPercentage, {
                width: 100,
                height: 10
            });

            let maxScrollPositions = mockPagingBrowser.computeMaxScrollPositions(state);

            Assertions.assertJSON(maxScrollPositions, {
                "x": 0,
                "y": 900
            });

            let pageDownScrollPosition = mockPagingBrowser.computePageDownScrollPosition(state);

            Assertions.assertJSON(pageDownScrollPosition, {
                "x": 0,
                "y": 90
            });

            // now try to page down until we're at the end of the document.

        });

        it("real world", async function () {

            let mockPagingBrowser = new MockPagingBrowser();

            let state = new PagingState({

                // the initial position after the page loads isn't scrolled.
                scrollPosition: {
                    x: 0,
                    y: 10608.181640625,
                },
                scrollBox: {
                    width: 646,
                    height: 11566,
                },
                viewportBox: {
                    width: 660,
                    height: 958,
                }

            });

            let visualScrollPercentage = await mockPagingBrowser.visualScrollPercentage(state);

            Assertions.assertJSON(visualScrollPercentage, {
                width: 100,
                height: 100
            });

        });

        it("paging", async function () {

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

            // **** nextPage (1)

            await mockPagingBrowser.pageDown();
            state = await mockPagingBrowser.state();

            let expected = {
                "scrollPosition": {
                    "x": 0,
                    "y": 67.5
                },
                "scrollBox": {
                    "width": 100,
                    "height": 200
                },
                "viewportBox": {
                    "width": 75,
                    "height": 75
                }
            };

            Assertions.assertJSON(state, expected);

            // *** now verify we are NOT finished scrolling

            state = await(mockPagingBrowser.state());

            let fullyPaginated = mockPagingBrowser.fullyPaginated(state);
            assert.equal(fullyPaginated, false);

            // **** nextPage (2)

            await mockPagingBrowser.pageDown();
            state = await mockPagingBrowser.state();

            expected = {
                "scrollPosition": {
                    "x": 0,
                    "y": 125
                },
                "scrollBox": {
                    "width": 100,
                    "height": 200
                },
                "viewportBox": {
                    "width": 75,
                    "height": 75
                }
            };

            Assertions.assertJSON(state, expected);

            // **** nextPage (3)

            await mockPagingBrowser.pageDown();
            state = await mockPagingBrowser.state();

            expected = {
                "scrollPosition": {
                    "x": 0,
                    "y": 125
                },
                "scrollBox": {
                    "width": 100,
                    "height": 200
                },
                "viewportBox": {
                    "width": 75,
                    "height": 75
                }
            };

            Assertions.assertJSON(state, expected);

            // *** now verify we are finished scrolling

            state = await(mockPagingBrowser.state());

            fullyPaginated = mockPagingBrowser.fullyPaginated(state);
            assert.equal(fullyPaginated, true);

        });


    });


});
