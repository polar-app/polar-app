"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheEntriesFactory = void 0;
const CacheEntriesHolder_1 = require("./CacheEntriesHolder");
const DiskCacheEntry_1 = require("./DiskCacheEntry");
const PHZCacheEntry_1 = require("./PHZCacheEntry");
const CachingPHZReader_1 = require("../../phz/CachingPHZReader");
const fs_1 = __importDefault(require("fs"));
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
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
            const cachingPHZReader = new CachingPHZReader_1.CachingPHZReader(path);
            const resources = yield cachingPHZReader.getResources();
            const cacheEntriesHolder = new CacheEntriesHolder_1.CacheEntriesHolder({});
            cacheEntriesHolder.metadata = yield cachingPHZReader.getMetadata();
            Dictionaries_1.Dictionaries.forDict(resources.entries, (key, resourceEntry) => {
                const resource = resourceEntry.resource;
                const url = resourceEntry.resource.url;
                if (!url) {
                    throw new Error("No url");
                }
                const cacheEntry = new PHZCacheEntry_1.PHZCacheEntry({
                    url,
                    method: resource.method,
                    headers: resource.headers,
                    statusCode: resource.statusCode,
                    statusMessage: resource.statusMessage || "OK",
                    contentType: resource.contentType,
                    docTypeFormat: resource.docTypeFormat,
                    mimeType: resource.encoding,
                    encoding: resource.encoding,
                    phzReader: cachingPHZReader,
                    resourceEntry
                });
                cacheEntriesHolder.cacheEntries[url] = cacheEntry;
            });
            return cacheEntriesHolder;
        });
    }
    static createFromCHTML(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const jsonPath = path.replace(".chtml", "") + ".json";
            const json = fs_1.default.readFileSync(jsonPath);
            const data = JSON.parse(json.toString("UTF-8"));
            let url = data.url;
            url = url.replace(/^https:/, "http:");
            return new CacheEntriesHolder_1.CacheEntriesHolder({
                metadata: {
                    url
                },
                cacheEntries: {
                    url: new DiskCacheEntry_1.DiskCacheEntry({
                        url,
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