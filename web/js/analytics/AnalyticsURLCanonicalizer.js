"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsURLCanonicalizer = void 0;
const DocPreviewURLs_1 = require("polar-webapp-links/src/docs/DocPreviewURLs");
class AnalyticsURLCanonicalizer {
    static canonicalize(path) {
        if (path.startsWith('/d/')) {
            return DocPreviewURLs_1.DocPreviewURLs.canonicalize(path);
        }
        return path;
    }
}
exports.AnalyticsURLCanonicalizer = AnalyticsURLCanonicalizer;
//# sourceMappingURL=AnalyticsURLCanonicalizer.js.map