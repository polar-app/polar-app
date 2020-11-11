"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("polar-shared/src/logger/Logger");
const BrowserDocLoader_1 = require("../../../web/js/apps/main/doc_loaders/browser/BrowserDocLoader");
const BackendFileRefs_1 = require("../../../web/js/datastore/BackendFileRefs");
const log = Logger_1.Logger.create();
function createInvitation() {
    const url = new URL(document.location.href);
    return JSON.parse(url.searchParams.get('invitation'));
}
function redirectToDocumentViewer(persistenceLayer, invitation) {
    return __awaiter(this, void 0, void 0, function* () {
        const docLoader = new BrowserDocLoader_1.BrowserDocLoader(() => persistenceLayer);
        const docRef = invitation.docs[0];
        const { fingerprint } = docRef;
        const docMeta = yield persistenceLayer.getDocMeta(fingerprint);
        if (!docMeta) {
            throw new Error("No DocMeta for fingerprint: " + fingerprint);
        }
        const backendFileRef = BackendFileRefs_1.BackendFileRefs.toBackendFileRef(docMeta);
        const loadDocRequest = {
            fingerprint,
            title: docMeta.docInfo.title || 'Untitled',
            backendFileRef,
            newWindow: false,
            url: undefined
        };
        const docLoadRequest = docLoader.create(loadDocRequest);
        yield docLoadRequest.load();
    });
}
function doHandle() {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
doHandle().catch(err => log.error("Unable to handle document share: ", err));
//# sourceMappingURL=index.js.map