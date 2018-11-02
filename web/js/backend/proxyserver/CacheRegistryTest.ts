import {TestingTime} from '../../test/TestingTime';
import {CapturedPHZWriter} from '../../capture/CapturedPHZWriter';
import {ProxyServerConfig} from './ProxyServerConfig';
import {CacheRegistry} from './CacheRegistry';
import {MockCapturedContent} from '../../capture/MockCapturedContent';
import {FilePaths} from '../../util/FilePaths';

TestingTime.freeze();

describe('CacheRegistryTest', function() {

    describe('Load PHZ', function() {

        it("registerFile", async function () {

            TestingTime.freeze();

            let captured = MockCapturedContent.create();

            let path = FilePaths.tmpfile("cached-entries-factory.phz");
            let capturedPHZWriter = new CapturedPHZWriter(path);
            await capturedPHZWriter.convert(captured);

            let proxyServerConfig = new ProxyServerConfig(12345);

            let cacheRegistry = new CacheRegistry(proxyServerConfig);

            await cacheRegistry.registerFile(path);

        });

    });

});
