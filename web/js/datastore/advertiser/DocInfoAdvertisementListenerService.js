"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocInfoAdvertisementListenerService = void 0;
const electron_1 = require("electron");
const Logger_1 = require("polar-shared/src/logger/Logger");
const SimpleReactor_1 = require("../../reactor/SimpleReactor");
const log = Logger_1.Logger.create();
class DocInfoAdvertisementListenerService {
    constructor() {
        this.reactor = new SimpleReactor_1.SimpleReactor();
        this.listener = this.onDocInfoAdvertisement.bind(this);
    }
    start() {
        electron_1.ipcRenderer.on('doc-info-advertisement', this.listener);
    }
    stop() {
        electron_1.ipcRenderer.removeListener('doc-info-advertisement', this.listener);
    }
    onDocInfoAdvertisement(event, docInfoAdvertisement) {
        log.debug("Received new DocInfo advertisement: ", docInfoAdvertisement);
        this.reactor.dispatchEvent(docInfoAdvertisement);
    }
    addEventListener(docInfoAdvertisementListener) {
        this.reactor.addEventListener(docInfoAdvertisementListener);
    }
}
exports.DocInfoAdvertisementListenerService = DocInfoAdvertisementListenerService;
//# sourceMappingURL=DocInfoAdvertisementListenerService.js.map