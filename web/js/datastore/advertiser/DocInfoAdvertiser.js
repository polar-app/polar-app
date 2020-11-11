"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocInfoAdvertiser = void 0;
const electron_1 = require("electron");
class DocInfoAdvertiser {
    static send(docInfoAdvertisement) {
        electron_1.ipcRenderer.send('doc-info-advertisement:broadcast', docInfoAdvertisement);
    }
}
exports.DocInfoAdvertiser = DocInfoAdvertiser;
//# sourceMappingURL=DocInfoAdvertiser.js.map