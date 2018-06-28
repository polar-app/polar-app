const assert = require('assert');
const url = require('url');
const fs = require('fs');
const {PHZWriter} = require("./PHZWriter");
const {PHZReader} = require("./PHZReader");
const {Resource} = require("./Resource");
const {ResourceFactory} = require("./ResourceFactory");
const {Files} = require("../util/Files");
const {assertJSON} = require("../test/Assertions");

require("../test/TestingTime").freeze();

describe('PHZ functionality', function() {

    it("ResourceFactory", function () {

        let resource = ResourceFactory.create("http://example.com", "text/html");

        let expected = {
            "id": "1XKZEWhTwbtoPFSkR2TJ",
            "created": "2012-03-02T11:38:49.321Z",
            "meta": {},
            "url": "http://example.com",
            "contentType": "text/html",
            "headers": {},
            "title": null,
            "description": null
        };

        assertJSON(resource, expected);

    });

    it("Writing with no data", async function () {

        let path = "/tmp/test.phz";

        await Files.unlinkAsync(path);

        let phzWriter = new PHZWriter(path);

        await phzWriter.close();

        assert.equal( await Files.existsAsync(path), true );

    });

    it("Writing one resource", async function () {

        let path = "/tmp/test.phz";

        await Files.unlinkAsync(path);

        let phzWriter = new PHZWriter(path);

        let resource = ResourceFactory.create("http://example.com", "text/html");

        phzWriter.writeResource(resource, "<html></html>");

        await phzWriter.close();

        assert.equal( await Files.existsAsync(path), true );

    });

    it("Reading", async function () {

        let path = "/tmp/test.phz";

        await Files.unlinkAsync(path);

        let phzWriter = new PHZWriter(path);
        let resource = ResourceFactory.create("http://example.com", "text/html");

        phzWriter.writeMetadata({
            title: "this is the title"
        });

        phzWriter.writeResource(resource, "<html></html>");
        await phzWriter.close();

        let phzReader = new PHZReader(path);
        await phzReader.init();

        let resources = await phzReader.getResources();

        let expected = {
            "entries": {
                "1XKZEWhTwbtoPFSkR2TJ": {
                    "id": "1XKZEWhTwbtoPFSkR2TJ",
                    "path": "1XKZEWhTwbtoPFSkR2TJ.html",
                    "resource": {
                        "id": "1XKZEWhTwbtoPFSkR2TJ",
                        "created": "2012-03-02T11:38:49.321Z",
                        "meta": {},
                        "url": "http://example.com",
                        "contentType": "text/html",
                        "headers": {},
                        "title": null,
                        "description": null
                    }
                }
            }
        };

        assertJSON(resources, expected);

        let resourceEntry = resources.entries["1XKZEWhTwbtoPFSkR2TJ"];

        let buffer = await phzReader.getResource(resourceEntry);

        let content = buffer.toString("UTF-8");

        assert.equal(content, "<html></html>");

        // test getting the metadata (when there isn't any)

        let metadata = await phzReader.getMetadata();

        expected = {
            "title": "this is the title"
        };
        assertJSON(metadata, expected);

    });

    it("Reading with no metadata or resources", async function () {

        let path = "/tmp/test.phz";

        await Files.unlinkAsync(path);

        let phzWriter = new PHZWriter(path);
        await phzWriter.close();

        let phzReader = new PHZReader(path);
        await phzReader.init();

        let resources = await phzReader.getResources();

        let expected = {
            "entries": {
            }
        };

        assertJSON(resources, expected);

        let metadata = await phzReader.getMetadata();
        assert.equal(metadata, null)

    });

});

