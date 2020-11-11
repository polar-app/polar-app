"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadPaths = void 0;
var UploadPaths;
(function (UploadPaths) {
    function parse(path) {
        const re = new RegExp("/?(([^/]+/)*)[^/]+");
        const match = path.match(re);
        if (match && match[1] !== '') {
            const result = match[1];
            if (result.endsWith("/")) {
                return result.substring(0, result.length - 1);
            }
            else {
                return result;
            }
        }
        else {
            return undefined;
        }
    }
    UploadPaths.parse = parse;
})(UploadPaths = exports.UploadPaths || (exports.UploadPaths = {}));
//# sourceMappingURL=UploadPaths.js.map