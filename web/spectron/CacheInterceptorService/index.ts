import {ProxyServerConfig} from '../../js/backend/proxyserver/ProxyServerConfig';
import {CacheRegistry} from '../../js/backend/proxyserver/CacheRegistry';
import {CacheInterceptorService} from '../../js/backend/interceptor/CacheInterceptorService';
import {SpectronMain2} from '../../js/test/SpectronMain2';

SpectronMain2.create().run(async state => {
    //
    // let proxyServerConfig = new ProxyServerConfig(1234);
    //
    // let cacheRegistry = new CacheRegistry(proxyServerConfig);
    //
    // let cacheInterceptorService = new CacheInterceptorService(cacheRegistry);
    //
    // await cacheInterceptorService.start();
    //
    // // add our phz file to the cache registry...
    // await cacheRegistry.registerFile('/tmp/cache-interceptor-service.phz');
    //
    // console.log("Interceptor service started...");
    //
    // let url = "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2";
    //
    // state.window.loadURL(url);

    // FIXME: ok.. this will NOT work because the app we're loading does not run
    // SpectronRenderer so we don't have any way to rendezvous around the result
    // of the test.

    state.window.loadURL(`file://${__dirname}/app.html`);

    console.log("Loaded main URL");

    //await Time.sleep(5000);

    await state.testResultWriter.write(true);

    console.log("Wrote results to test writer!");

});

