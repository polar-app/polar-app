const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');
const {assertJSON} = require('../../test/Assertions');

const {CacheEntriesFactory} = require('./CacheEntriesFactory');

describe('CacheEntriesFactory', function() {

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

        it("createFromCHTML", async function () {

            let cacheEntriesHolder = await CacheEntriesFactory.createFromCHTML(path);

            assertJSON(cacheEntriesHolder, {
                "cacheEntries": {
                    "url": {
                        "method": "GET",
                        "url": "http://jakearchibald.com/2016/streams-ftw/",
                        "headers": {
                            "Content-Type": "text/html"
                        },
                        "statusCode": 200,
                        "statusMessage": "OK",
                        "contentLength": null,
                        "path": "/tmp/test-load.chtml"
                    }
                },
                "metadata": {
                    "url": "http://jakearchibald.com/2016/streams-ftw/"
                }
            });

            assert.equal(cacheEntriesHolder.metadata.url, "http://jakearchibald.com/2016/streams-ftw/");

        });


        it("createEntriesFromFile", async function () {

            let cacheEntriesHolder = await CacheEntriesFactory.createEntriesFromFile(path);

            assertJSON(cacheEntriesHolder, {
                "cacheEntries": {
                    "url": {
                        "method": "GET",
                        "url": "http://jakearchibald.com/2016/streams-ftw/",
                        "headers": {
                            "Content-Type": "text/html"
                        },
                        "statusCode": 200,
                        "statusMessage": "OK",
                        "contentLength": null,
                        "path": "/tmp/test-load.chtml"
                    }
                },
                "metadata": {
                    "url": "http://jakearchibald.com/2016/streams-ftw/"
                }
            })

        });

    });

});
