import assert from 'assert';
import {TestingTime} from '../test/TestingTime';
import {ResourceFactory} from './ResourceFactory';
import {assertJSON} from '../test/Assertions';
import {Files} from '../util/Files';
import {PHZWriter} from './PHZWriter';
import {PHZReader} from './PHZReader';
import {Dictionaries} from '../util/Dictionaries';
import {FilePaths} from '../util/FilePaths';

TestingTime.freeze();

describe('PHZ functionality', function() {

    it("ResourceFactory", function () {

        let resource = ResourceFactory.create("http://example.com", "text/html");

        let expected = {
            "id": "1XKZEWhTwbtoPFSkR2TJ",
            "created": "2012-03-02T11:38:49.321Z",
            "meta": {},
            "url": "http://example.com",
            "contentType": "text/html",
            "mimeType": "text/html",
            "encoding": "UTF-8",
            "method": "GET",
            "statusCode": 200,
            "headers": {},
        };

        assertJSON(Dictionaries.sorted(resource), Dictionaries.sorted(expected));

    });

    it("Writing with no data", async function () {

        let path = FilePaths.tmpfile("test.phz");

        await Files.unlinkAsync(path);

        let phzWriter = new PHZWriter(path);

        await phzWriter.close();

        assert.equal( await Files.existsAsync(path), true );

    });

    it("Writing one resource", async function () {

        let path = FilePaths.tmpfile("test.phz");

        await Files.unlinkAsync(path);

        let phzWriter = new PHZWriter(path);

        let resource = ResourceFactory.create("http://example.com", "text/html");

        await phzWriter.writeResource(resource, "<html></html>");

        await phzWriter.close();

        assert.equal( await Files.existsAsync(path), true );

    });

    it("Reading", async function () {

        let path = FilePaths.tmpfile("test.phz");

        await Files.unlinkAsync(path);

        let phzWriter = new PHZWriter(path);
        let resource = ResourceFactory.create("http://example.com", "text/html");

        await phzWriter.writeMetadata({
            title: "this is the title"
        });

        await phzWriter.writeResource(resource, "<html></html>");
        await phzWriter.close();

        let phzReader = new PHZReader(path);
        await phzReader.init();

        let resources = await phzReader.getResources();

        let expected: any = {
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
                        "mimeType": "text/html",
                        "encoding": "UTF-8",
                        "method": "GET",
                        "statusCode": 200,
                        "headers": {},
                    }
                }
            }
        };

        assertJSON(Dictionaries.sorted(resources), Dictionaries.sorted(expected));

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

        let path = FilePaths.tmpfile("test.phz");

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

