"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DocFormats {
    static getFormat() {
        let polarDocFormat = document.querySelector("meta[name='polar-doc-format']");
        if (polarDocFormat) {
            return polarDocFormat.getAttribute("content");
        }
        return null;
    }
}
exports.DocFormats = DocFormats;
//# sourceMappingURL=DocFormats.js.map