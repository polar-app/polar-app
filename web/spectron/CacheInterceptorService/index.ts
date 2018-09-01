
import {SpectronMain} from '../../js/test/SpectronMain';
import {ProxyServerConfig} from '../../js/backend/proxyserver/ProxyServerConfig';
import {CacheRegistry} from '../../js/backend/proxyserver/CacheRegistry';
import {CacheInterceptorService} from '../../js/backend/interceptor/CacheInterceptorService';

async function start() {

    let mainWindow = await SpectronMain.setup();

    let proxyServerConfig = new ProxyServerConfig(1234);

    let cacheRegistry = new CacheRegistry(proxyServerConfig);

    let cacheInterceptorService = new CacheInterceptorService(cacheRegistry);

    await cacheInterceptorService.start();

    // add our phz file to the cache registry...
    await cacheRegistry.registerFile('/tmp/cache-interceptor-service.phz');
    //.catch(err => console.log(err));

    console.log("Interceptor service started...");

    let url = "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2";

    mainWindow.loadURL(url);

    console.log("Loaded main URL")

}

start().catch(err => console.log(err));
