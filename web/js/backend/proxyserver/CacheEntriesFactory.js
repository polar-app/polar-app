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
const Functions_1 = require("../../util/Functions");
const CacheEntriesHolder_1 = require("./CacheEntriesHolder");
const DiskCacheEntry_1 = require("./DiskCacheEntry");
const PHZCacheEntry_1 = require("./PHZCacheEntry");
const CachingPHZReader_1 = require("../../phz/CachingPHZReader");
const fs = require("fs");
class CacheEntriesFactory {
    static createEntriesFromFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (path.endsWith(".chtml")) {
                return CacheEntriesFactory.createFromCHTML(path);
            }
            else if (path.endsWith(".phz")) {
                return CacheEntriesFactory.createFromPHZ(path);
            }
            else {
                throw new Error("Unable to handle file type for path: " + path);
            }
        });
    }
    static createFromHTML(url, path) {
        return new DiskCacheEntry_1.DiskCacheEntry({
            url,
            method: "GET",
            headers: {
                "Content-Type": "text/html"
            },
            statusCode: 200,
            statusMessage: "OK",
            path
        });
    }
    static createFromPHZ(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let cachingPHZReader = new CachingPHZReader_1.CachingPHZReader(path);
            let resources = yield cachingPHZReader.getResources();
            let cacheEntriesHolder = new CacheEntriesHolder_1.CacheEntriesHolder({});
            cacheEntriesHolder.metadata = yield cachingPHZReader.getMetadata();
            Functions_1.forDict(resources.entries, (key, resourceEntry) => {
                let resource = resourceEntry.resource;
                let url = resourceEntry.resource.url;
                if (!url) {
                    throw new Error("No url");
                }
                let cacheEntry = new PHZCacheEntry_1.PHZCacheEntry({
                    url,
                    method: resource.method,
                    headers: resource.headers,
                    statusCode: resource.statusCode,
                    statusMessage: resource.statusMessage,
                    contentType: resource.contentType,
                    mimeType: resource.encoding,
                    encoding: resource.encoding,
                    phzReader: cachingPHZReader,
                    resourceEntry: resourceEntry
                });
                cacheEntriesHolder.cacheEntries[url] = cacheEntry;
            });
            return cacheEntriesHolder;
        });
    }
    static createFromCHTML(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let jsonPath = path.replace(".chtml", "") + ".json";
            let json = fs.readFileSync(jsonPath);
            let data = JSON.parse(json.toString("UTF-8"));
            let url = data.url;
            url = url.replace(/^https:/, "http:");
            return new CacheEntriesHolder_1.CacheEntriesHolder({
                metadata: {
                    url
                },
                cacheEntries: {
                    url: new DiskCacheEntry_1.DiskCacheEntry({
                        url: url,
                        method: "GET",
                        headers: {
                            "Content-Type": "text/html"
                        },
                        statusCode: 200,
                        statusMessage: "OK",
                        path
                    })
                }
            });
        });
    }
}
exports.CacheEntriesFactory = CacheEntriesFactory;
//# sourceMappingURL=CacheEntriesFactory.js.map