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
const AppPaths_1 = require("../webresource/AppPaths");
const WebResource_1 = require("../webresource/WebResource");
const Preconditions_1 = require("../../Preconditions");
const { Paths } = require("../../util/Paths");
const { Fingerprints } = require("../../util/Fingerprints");
const log = require("../../logger/Logger").create();
class PHZLoader {
    constructor(opts) {
        Object.assign(this, opts);
        Preconditions_1.Preconditions.assertNotNull(this.cacheRegistry, "cacheRegistry");
    }
    registerForLoad(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let cachedRequestsHolder = yield this.cacheRegistry.registerFile(path);
            log.info("cachedRequestsHolder: " + JSON.stringify(cachedRequestsHolder));
            let cachedRequest = cachedRequestsHolder.cachedRequests[cachedRequestsHolder.metadata.url];
            console.log("Going to load URL: " + cachedRequest.url);
            let descriptor = cachedRequestsHolder.metadata;
            let descriptorJSON = JSON.stringify(descriptor);
            let basename = Paths.basename(path);
            let fingerprint = Fingerprints.create(basename);
            let appPath = AppPaths_1.AppPaths.createFromRelative('./htmlviewer/index.html');
            let queryData = `#?file=${encodeURIComponent(cachedRequest.url)}&fingerprint=${fingerprint}&descriptor=${encodeURIComponent(descriptorJSON)}`;
            let appURL = 'file://' + appPath + queryData;
            return WebResource_1.WebResource.createURL(appURL);
        });
    }
}
exports.PHZLoader = PHZLoader;
//# sourceMappingURL=PHZLoader.js.map