
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

    console.log("Interceptor service started...");

    mainWindow.loadURL("https://www.example.com");

    console.log("Loaded main URL")

}

start().catch(err => console.log(err));
