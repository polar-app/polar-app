"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepoDocMetaLoaders = void 0;
const Throttler_1 = require("../../../web/js/datastore/Throttler");
class RepoDocMetaLoaders {
    static addThrottlingEventListener(repoDocMetaLoader, callback) {
        const throttlerOpts = { maxRequests: 250, maxTimeout: 500 };
        const refreshThrottler = new Throttler_1.Throttler(() => callback(), throttlerOpts);
        return repoDocMetaLoader.addEventListener(event => {
            refreshThrottler.exec();
        });
    }
}
exports.RepoDocMetaLoaders = RepoDocMetaLoaders;
//# sourceMappingURL=RepoDocMetaLoaders.js.map