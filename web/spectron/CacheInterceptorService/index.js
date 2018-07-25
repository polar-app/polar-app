
const electron = require('electron');
const {ProxyServerConfig} = require("../../js/backend/proxyserver/ProxyServerConfig");
const {CacheRegistry} = require("../../js/backend/proxyserver/CacheRegistry");
const {CacheInterceptorService} = require("../../js/backend/interceptor/CacheInterceptorService");
const {SpectronRenderer} = require("../../js/test/SpectronRenderer");
const {Logger} = require("../../js/logger/Logger");
const app = electron.app;

async function start() {

    let mainWindow = await SpectronRenderer.start();

    await Logger.init("/tmp/cache-interceptor-service-logs");

    let proxyServerConfig = new ProxyServerConfig(1234);

    let cacheRegistry = new CacheRegistry(proxyServerConfig);

    let cacheInterceptorService = new CacheInterceptorService(cacheRegistry);

    await cacheInterceptorService.start();

    // add our phz file to the cache registry...
    await cacheRegistry.registerFile("/tmp/cache-interceptor-service.phz");
    //.catch(err => console.log(err));

    console.log("Interceptor service started...");

    let url = "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2";
    //let url = "https://www.cnn.com";
    //let url = "https://www.cnn.com/us/live-news/immigration-border-separations-protests/h_313485921ffafc2a2ef7b4ca8af8dc44";

    mainWindow.loadURL(url);

    console.log("Loaded main URL")

}

start().catch(err => console.log(err));
