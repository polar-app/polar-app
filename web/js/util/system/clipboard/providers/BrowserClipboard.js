"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserClipboard = void 0;
class BrowserClipboard {
    writeText(text) {
        navigator.clipboard.writeText(text);
    }
    static supported() {
        return navigator && navigator.clipboard && navigator.clipboard.writeText;
    }
}
exports.BrowserClipboard = BrowserClipboard;
//# sourceMappingURL=BrowserClipboard.js.map