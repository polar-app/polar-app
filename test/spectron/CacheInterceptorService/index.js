
const electron = require('electron');
const {ProxyServerConfig} = require("../../../web/js/backend/proxyserver/ProxyServerConfig");
const {CacheRegistry} = require("../../../web/js/backend/proxyserver/CacheRegistry");
const {CacheInterceptorService} = require("../../../web/js/backend/interceptor/CacheInterceptorService");
const {SpectronRenderer} = require("../../../web/js/test/SpectronRenderer");
const app = electron.app;

async function start() {

    let mainWindow = await SpectronRenderer.start();

    let proxyServerConfig = new ProxyServerConfig(1234);

    let cacheRegistry = new CacheRegistry(proxyServerConfig);

    let cacheInterceptorService = new CacheInterceptorService(cacheRegistry);

    await cacheInterceptorService.start();

    // add our phz file to the cache registry...
    await cacheRegistry.registerFile("/tmp/cache-interceptor-service.phz");
    //.catch(err => console.log(err));

    console.log("Interceptor service started...");

    let url = "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2";
    //let url = "https://www.example.com";

    mainWindow.loadURL(url);

    console.log("Loaded main URL")

}

start().catch(err => console.log(err));
