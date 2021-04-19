import {TestingTime} from 'polar-shared/src/test/TestingTime';
import {CapturedPHZWriter} from 'polar-content-capture/src/phz/CapturedPHZWriter';
import {CacheRegistry} from './CacheRegistry';
import {MockCapturedContent} from 'polar-content-capture/src/phz/MockCapturedContent';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {PHZWriter} from "polar-content-capture/src/phz/PHZWriter";

TestingTime.freeze();

xdescribe('CacheRegistryTest', function() {

    describe('Load PHZ', function() {

        it("registerFile", async function() {

            TestingTime.freeze();

            const captured = MockCapturedContent.create();

            const path = FilePaths.tmpfile("cached-entries-factory.phz");
            const output = new PHZWriter(path);
            const capturedPHZWriter = new CapturedPHZWriter(output);
            await capturedPHZWriter.convert(captured);

            const cacheRegistry = new CacheRegistry();

            await cacheRegistry.registerFile(path);

        });

    });

});
