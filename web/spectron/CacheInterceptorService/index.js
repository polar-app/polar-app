"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const SpectronMain_1 = require("../../js/test/SpectronMain");
const ProxyServerConfig_1 = require("../../js/backend/proxyserver/ProxyServerConfig");
const CacheRegistry_1 = require("../../js/backend/proxyserver/CacheRegistry");
const CacheInterceptorService_1 = require("../../js/backend/interceptor/CacheInterceptorService");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        let mainWindow = yield SpectronMain_1.SpectronMain.setup();
        let proxyServerConfig = new ProxyServerConfig_1.ProxyServerConfig(1234);
        let cacheRegistry = new CacheRegistry_1.CacheRegistry(proxyServerConfig);
        let cacheInterceptorService = new CacheInterceptorService_1.CacheInterceptorService(cacheRegistry);
        yield cacheInterceptorService.start();
        yield cacheRegistry.registerFile('/tmp/cache-interceptor-service.phz');
        console.log("Interceptor service started...");
        let url = "https://journal.artfuldev.com/unit-testing-node-applications-with-typescript-using-mocha-and-chai-384ef05f32b2";
        mainWindow.loadURL(url);
        console.log("Loaded main URL");
    });
}
start().catch(err => console.log(err));
//# sourceMappingURL=index.js.map