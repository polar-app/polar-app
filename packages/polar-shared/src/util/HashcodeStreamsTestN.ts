import {assert} from 'chai';
import {FilePaths} from './FilePaths';
import {Files} from './Files';
import {HashcodeStreams} from "./HashcodeStreams";

describe('HashcodeStreams', function() {

    describe('createFromStream', function() {

        it("basic", async function () {

            const data = "this is a test";

            let path = FilePaths.createTempName('hash-test-data.txt');

            await Files.writeFileAsync(path, data);

            const hashcode = await HashcodeStreams.createFromStream(Files.createReadStream(path));

            assert.equal(hashcode, "12DPFtaSkqZ1BDBXxY47ThYmzinkWJ6jCMmuJvVZfCdaNViiRwu");

        });

    });

});
