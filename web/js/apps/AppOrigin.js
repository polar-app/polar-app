"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppOrigin = void 0;
class AppOrigin {
    static configure() {
        if (document && document.location && document.location.href) {
            const href = document.location.href;
            if (href.indexOf('getpolarized.io') !== -1) {
                document.domain = 'getpolarized.io';
            }
        }
    }
}
exports.AppOrigin = AppOrigin;
//# sourceMappingURL=AppOrigin.js.map