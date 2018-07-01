
const electron = require('electron');
const ProxyServerConfig = require("../../../web/js/backend/proxyserver/ProxyServerConfig").ProxyServerConfig;
const CacheRegistry = require("../../../web/js/backend/proxyserver/CacheRegistry").CacheRegistry;
const {CacheInterceptorService} = require("../../../web/js/backend/interceptor/CacheInterceptorService");
const {SpectronRenderer} = require("../../../web/js/test/SpectronRenderer");
const app = electron.app;

async function start() {

    let mainWindow = await SpectronRenderer.start();

    let proxyServerConfig = new ProxyServerConfig(1234);

    let cacheRegistry = new CacheRegistry(proxyServerConfig);

    let cacheInterceptorService = new CacheInterceptorService(cacheRegistry);

    await cacheInterceptorService.start();



}

start().catch(err => console.log(err));
