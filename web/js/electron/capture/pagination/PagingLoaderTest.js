const assert = require('assert');
const url = require('url');
const MockPagingBrowser = require("./MockPagingBrowser").MockPagingBrowser;

const {PagingLoader} = require('./PaginationLoader');

describe('PagingLoader', function() {

    describe('Test method call', function() {

        it("basic", function () {

            let mockPagingBrowser = new MockPagingBrowser();

            let pagingLoader = new PagingLoader(mockPagingBrowser);

            pagingLoader.onLoad();


        });

    });

});
