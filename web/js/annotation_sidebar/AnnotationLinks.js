"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnotationLinks = void 0;
const ResourcePaths_1 = require("../electron/webresource/ResourcePaths");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const HashURLs_1 = require("polar-shared/src/util/HashURLs");
var AnnotationLinks;
(function (AnnotationLinks) {
    function createHash(ptr) {
        const nonce = Math.floor(Math.random() * 100000);
        const pos = ptr.pos || 'top';
        return `?page=${ptr.pageNum}&target=${ptr.target}&pos=${pos}&n=${nonce}`;
    }
    AnnotationLinks.createHash = createHash;
    function createURL(ptr) {
        const docID = ptr.docID;
        const hash = createHash(ptr);
        return ResourcePaths_1.ResourcePaths.resourceURLFromRelativeURL(`/doc/${docID}#${hash}`);
    }
    AnnotationLinks.createURL = createURL;
    function parse(queryOrLocation) {
        const params = HashURLs_1.HashURLs.parse(queryOrLocation);
        const page = Optional_1.Optional.of(params.get('page')).map(parseInt).getOrUndefined();
        const target = params.get('target') || undefined;
        if (page === undefined && target === undefined) {
            return undefined;
        }
        return {
            page, target
        };
    }
    AnnotationLinks.parse = parse;
})(AnnotationLinks = exports.AnnotationLinks || (exports.AnnotationLinks = {}));
//# sourceMappingURL=AnnotationLinks.js.map