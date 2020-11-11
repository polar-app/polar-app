"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharingDatastores = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const SharingDatastore_1 = require("./SharingDatastore");
class SharingDatastores {
    static create(url = this.currentURL()) {
        const params = this.parseURL(url);
        if (!params) {
            throw new Error("Not a sharing URL: " + url);
        }
        return new SharingDatastore_1.SharingDatastore(params.doc, params.fingerprint);
    }
    static isSupported() {
        const params = this.parseURL();
        return params !== undefined;
    }
    static parseURL(url = this.currentURL()) {
        const parsedURL = new URL(url);
        if (parsedURL.hostname.endsWith(".getpolarized.io")) {
            const shared = parsedURL.searchParams.get("shared");
            const doc = parsedURL.searchParams.get("doc");
            const fingerprint = parsedURL.searchParams.get("fingerprint");
            if (shared === 'true' && Preconditions_1.isPresent(doc)) {
                return {
                    shared: true,
                    doc: doc,
                    fingerprint: fingerprint
                };
            }
        }
        return undefined;
    }
    static currentURL() {
        return document.location.href;
    }
}
exports.SharingDatastores = SharingDatastores;
//# sourceMappingURL=SharingDatastores.js.map