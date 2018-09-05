import {TestingTime} from '../test/TestingTime';
import {assert} from 'chai';
import {FilePaths} from '../util/FilePaths';
import {MockPHZWriter} from './MockPHZWriter';
import * as fs from 'fs';

TestingTime.freeze();

describe('MockPHZWriter', function() {

    it("Write basic file", async function () {

        let path = FilePaths.tmpfile("test-mock-phz-writer.phz");
        await MockPHZWriter.write(path);
        assert.equal(fs.existsSync(path), true);

    });

});

