const assert = require('assert');
const url = require('url');
const fs = require('fs');
const {PHZWriter} = require("./PHZWriter");
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

        await phzWriter.save();

        assert.equal( await Files.existsAsync(path), true );

    });

    it("Writing one resource", async function () {

        let path = "/tmp/test.phz";

        await Files.unlinkAsync(path);

        let phzWriter = new PHZWriter(path);

        let resource = ResourceFactory.create("http://example.com", "text/html");

        phzWriter.writeResource(resource, "<html></html>");

        await phzWriter.save();

        assert.equal( await Files.existsAsync(path), true );

    });


});
