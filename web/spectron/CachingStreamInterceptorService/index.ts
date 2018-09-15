import {assert} from 'chai';
import {ProxyServerConfig} from '../../js/backend/proxyserver/ProxyServerConfig';
import {CacheRegistry} from '../../js/backend/proxyserver/CacheRegistry';
import {SpectronMain2} from '../../js/test/SpectronMain2';
import {WebContentsPromises} from '../../js/electron/framework/WebContentsPromises';
import {FilePaths} from '../../js/util/FilePaths';
import {CachingStreamInterceptorService} from '../../js/backend/interceptor/CachingStreamInterceptorService';
import waitForExpect from 'wait-for-expect';

SpectronMain2.create().run(async state => {
    //
    const proxyServerConfig = new ProxyServerConfig(1234);

    const cacheRegistry = new CacheRegistry(proxyServerConfig);

    const service = new CachingStreamInterceptorService(cacheRegistry);

    await service.start();
    //
    // // add our phz file to the cache registry...

    const path = FilePaths.createTempName("cache-interceptor-service.phz");

    await cacheRegistry.registerFile(path);

    console.log("Interceptor service started...");

    // noinspection TsLint
    const url = "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2";

    const didFinishLoadPromise = WebContentsPromises.once(state.window.webContents).didFinishLoad();

    state.window.loadURL(url);

    await didFinishLoadPromise;

    await waitForExpect(() => {
        assert.equal(service.cacheStats.hits, 15, "Invalid number of hits");
    });

    // await state.testResultWriter.write(true);

    console.log("Wrote results to test writer!");

});

