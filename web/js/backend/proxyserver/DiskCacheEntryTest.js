const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');
const {DiskCacheEntry} = require('./DiskCacheEntry');

describe('DiskCacheEntry', function() {

    describe('Test reading data', function() {

        it("basic", async function () {

            let path = "/tmp/test.txt";
            let testData = "this is some data";
            fs.writeFileSync(path, testData);

            let diskCacheEntry = new DiskCacheEntry({
                url: "http://foo.com/second.txt",
                method: "GET",
                headers: {
                    "Content-Type": "text/html"
                },
                statusCode: 200,
                statusMessage: "OK",
                contentLength: 30,
                path
            });

            let data = null;

            await diskCacheEntry.handleData(function (d) {
                data = d;
            });

            assert.equal(data, testData);

        });

    });

});
