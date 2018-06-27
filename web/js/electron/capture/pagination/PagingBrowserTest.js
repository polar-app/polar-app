
const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');
const Assertions = require("../../../test/Assertions");
const MockPagingBrowser = require("./MockPagingBrowser").MockPagingBrowser;

const {PagingBrowser} = require('./PagingBrowser');

describe('PagingBrowser', function() {

    describe('Basic functionality', function() {

        it("basic", async function () {

            let mockPagingBrowser = new MockPagingBrowser();

            mockPagingBrowser.setState({

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

            let visualScrollPercentage = await mockPagingBrowser.visualScrollPercentage()

            Assertions.assertJSON(visualScrollPercentage, {
                width: 100,
                height: 10
            });

        });

    });

});
