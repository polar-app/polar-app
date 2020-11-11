"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URLParams = void 0;
class URLParams {
    static createJSON(obj) {
        return encodeURIComponent(JSON.stringify(obj));
    }
}
exports.URLParams = URLParams;
//# sourceMappingURL=URLParams.js.map