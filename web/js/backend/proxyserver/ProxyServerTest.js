"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const ProxyServerConfig_1 = require("./ProxyServerConfig");
const CacheRegistry_1 = require("./CacheRegistry");
const ProxyServer_1 = require("./ProxyServer");
const BufferedCacheEntry_1 = require("./BufferedCacheEntry");
const Http_1 = require("../../util/Http");
const url = require('url');
const HttpProxyAgent = require('http-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');
describe('ProxyServer', function () {
    let proxyServer = undefined;
    let cacheRegistry;
    beforeEach(function (done) {
        console.log("Starting...");
        let proxyServerConfig = new ProxyServerConfig_1.ProxyServerConfig(8090);
        cacheRegistry = new CacheRegistry_1.CacheRegistry(proxyServerConfig);
        proxyServer = new ProxyServer_1.ProxyServer(proxyServerConfig, cacheRegistry);
        proxyServer.start();
        console.log("Starting...done");
        cacheRegistry.register(new BufferedCacheEntry_1.BufferedCacheEntry({
            url: "http://foo.com/index.html",
            method: "GET",
            headers: {
                "Content-Type": "text/html"
            },
            statusCode: 200,
            statusMessage: "OK",
            data: "this is our first cache entry"
        }));
        cacheRegistry.register(new BufferedCacheEntry_1.BufferedCacheEntry({
            url: "http://foo.com/second.html",
            method: "GET",
            headers: {
                "Content-Type": "text/html"
            },
            statusCode: 200,
            statusMessage: "OK",
            contentLength: 30,
            data: "this is our second cache entry"
        }));
        done();
    });
    afterEach(function (done) {
        console.log("Stopping...");
        proxyServer.stop();
        console.log("Stopping...done");
        done();
    });
    describe('proxying', function () {
        it("basic", function () {
        });
        it("Proxy HTTP requests", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let agent = new HttpProxyAgent("http://localhost:8090");
                let link = "http://httpbin.org/get?message=hello+world";
                let content = yield testWithAgent(link, agent);
                assert_1.default.equal(content.toString().indexOf("hello world") > -1, true);
            });
        });
        it("Proxy HTTPS requests", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let agent = new HttpsProxyAgent("http://localhost:8090");
                let link = "https://httpbin.org/get?message=hello+world";
                let content = yield testWithAgent(link, agent);
                assert_1.default.equal(content.toString().indexOf("hello world") > -1, true);
            });
        });
    });
    describe('caching', function () {
        it("hasEntry", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let link = "http://foo.com/index.html";
                assert_1.default.equal(cacheRegistry.hasEntry(link), true);
            });
        });
        it("basic", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let agent = new HttpProxyAgent("http://localhost:8090");
                let link = "http://foo.com/index.html";
                let executed = yield executeWithAgent(link, agent);
                assert_1.default.equal(executed.data.toString(), "this is our first cache entry");
                assert_1.default.equal(executed.response.headers["x-polar-cache"], "hit");
            });
        });
        it("second request with content-length", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let agent = new HttpProxyAgent("http://localhost:8090");
                let link = "http://foo.com/second.html";
                let executed = yield executeWithAgent(link, agent);
                assert_1.default.equal(executed.data.toString(), "this is our second cache entry");
                assert_1.default.equal(executed.response.headers["x-polar-cache"], "hit");
                assert_1.default.equal(executed.response.headers["content-length"], "30");
            });
        });
    });
});
function testWithAgent(link, agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = url.parse(link);
        options.method = "GET";
        options.agent = agent;
        let content = yield Http_1.Http.fetchContent(options);
        return content.toString();
    });
}
function executeWithAgent(link, agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let options = url.parse(link);
        options.method = "GET";
        options.agent = agent;
        return yield Http_1.Http.execute(options);
    });
}
//# sourceMappingURL=ProxyServerTest.js.map