"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clipboards = void 0;
const BrowserClipboard_1 = require("./providers/BrowserClipboard");
class Clipboards {
    static getInstance() {
        return new BrowserClipboard_1.BrowserClipboard();
    }
}
exports.Clipboards = Clipboards;
//# sourceMappingURL=Clipboards.js.map