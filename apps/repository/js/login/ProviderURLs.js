"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderURLs = void 0;
const HashURLs_1 = require("polar-shared/src/util/HashURLs");
var ProviderURLs;
(function (ProviderURLs) {
    function parse(location) {
        const params = HashURLs_1.HashURLs.parse(location);
        const provider = params.get('provider') || undefined;
        return { provider };
    }
    ProviderURLs.parse = parse;
})(ProviderURLs = exports.ProviderURLs || (exports.ProviderURLs = {}));
//# sourceMappingURL=ProviderURLs.js.map