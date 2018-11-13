import {TestingTime} from '../../test/TestingTime';
import {CapturedPHZWriter} from '../../capture/CapturedPHZWriter';
import {ProxyServerConfig} from './ProxyServerConfig';
import {CacheRegistry} from './CacheRegistry';
import {MockCapturedContent} from '../../capture/MockCapturedContent';
import {FilePaths} from '../../util/FilePaths';

TestingTime.freeze();

describe('CacheRegistryTest', function() {

    describe('Load PHZ', function() {

        it("registerFile", async function() {

            TestingTime.freeze();

            const captured = MockCapturedContent.create();

            const path = FilePaths.tmpfile("cached-entries-factory.phz");
            const capturedPHZWriter = new CapturedPHZWriter(path);
            await capturedPHZWriter.convert(captured);

            const proxyServerConfig = new ProxyServerConfig(12345);

            const cacheRegistry = new CacheRegistry(proxyServerConfig);

            await cacheRegistry.registerFile(path);

        });

    });

});
