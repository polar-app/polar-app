"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewerAppURLs = void 0;
class DocViewerAppURLs {
    static parse(url) {
        const regexp = ".*/doc/([^/?#]+)(#([^#/]+)?)?$";
        const matches = url.match(regexp);
        if (!matches) {
            return undefined;
        }
        return {
            id: matches[1]
        };
    }
}
exports.DocViewerAppURLs = DocViewerAppURLs;
//# sourceMappingURL=DocViewerAppURLs.js.map