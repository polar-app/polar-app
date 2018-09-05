import {FilePaths} from "../../util/FilePaths";
import {DiskCacheEntry} from './DiskCacheEntry';
import {assert} from 'chai';
import * as fs from 'fs';

describe('DiskCacheEntry', function() {

    describe('Test reading data', function() {

        it("basic", async function () {

            let path = FilePaths.tmpfile("test.txt");
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
