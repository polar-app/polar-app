const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');

const {DiskCacheEntryFactory} = require('./DiskCacheEntryFactory');

describe('DiskCacheEntryFactory', function() {

    describe('Load CHTML', function() {

        let path = "/tmp/test-load.chtml";

        beforeEach(function(done) {

            let data = {
                "href": "https://jakearchibald.com/2016/streams-ftw/",
                "mutations": {
                    "baseAdded": true,
                    "eventAttributesRemoved": 0,
                    "existingBaseRemoved": false,
                    "javascriptAnchorsRemoved": 0,
                    "scriptsRemoved": 11,
                    "showAriaHidden": 5
                },
                "scrollHeight": 16830,
                "title": "2016 - the year of web streams - JakeArchibald.com",
                "url": "https://jakearchibald.com/2016/streams-ftw/"
            };

            fs.writeFileSync("/tmp/test-load.json", JSON.stringify(data, null, "  "));

            fs.writeFileSync("/tmp/test-load.chtml", "<html></html>")

            done();

        });

        it("createFromStaticCHTML", function () {

            let diskCacheEntry = DiskCacheEntryFactory.createFromStaticCHTML(path);

            assert.equal(diskCacheEntry.url, "http://jakearchibald.com/2016/streams-ftw/");

        });


        it("createFromFile", function () {

            let diskCacheEntry = DiskCacheEntryFactory.createFromFile(path);

            assert.equal(diskCacheEntry.url, "http://jakearchibald.com/2016/streams-ftw/");

        });

    });

});
