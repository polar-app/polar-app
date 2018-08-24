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
const Preconditions_1 = require("../../Preconditions");
const CachedRequestsHolder_1 = require("./CachedRequestsHolder");
const CachedRequest_1 = require("./CachedRequest");
const CacheEntriesFactory_1 = require("./CacheEntriesFactory");
const Functions_1 = require("../../util/Functions");
const path = require('path');
class CacheRegistry {
    constructor(proxyServerConfig) {
        this.registry = {};
        this.proxyServerConfig = Preconditions_1.Preconditions.assertNotNull(proxyServerConfig);
        this.registry = {};
    }
    registerFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let cacheEntriesHolder = yield CacheEntriesFactory_1.CacheEntriesFactory.createEntriesFromFile(path);
            let cachedRequestsHolder = new CachedRequestsHolder_1.CachedRequestsHolder({
                metadata: cacheEntriesHolder.metadata
            });
            if (!cacheEntriesHolder.cacheEntries) {
                throw new Error("No cache entries!");
            }
            Functions_1.forDict(cacheEntriesHolder.cacheEntries, (key, cacheEntry) => {
                let cacheMeta = this.register(cacheEntry);
                cachedRequestsHolder.cachedRequests[cacheMeta.url] = cacheMeta;
            });
            return cachedRequestsHolder;
        });
    }
    register(cacheEntry) {
        Preconditions_1.Preconditions.assertNotNull(cacheEntry, "cacheEntry");
        Preconditions_1.Preconditions.assertNotNull(cacheEntry.statusCode, "cacheEntry.statusCode");
        Preconditions_1.Preconditions.assertNotNull(cacheEntry.headers, "cacheEntry.headers");
        let url = cacheEntry.url;
        Preconditions_1.Preconditions.assertNotNull(url, "url");
        console.log(`Registered new cache entry at: ${url}`);
        this.registry[url] = cacheEntry;
        return new CachedRequest_1.CachedRequest({
            url,
            proxyRules: `http=localhost:${this.proxyServerConfig.port}`,
            proxyBypassRules: "<local>"
        });
    }
    hasEntry(url) {
        return url in this.registry;
    }
    get(url) {
        if (!this.hasEntry(url)) {
            throw new Error("URL not registered: " + url);
        }
        return this.registry[url];
    }
}
exports.CacheRegistry = CacheRegistry;
//# sourceMappingURL=CacheRegistry.js.map