"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const { DocMeta } = require("../metadata/DocMeta");
const { DocMetas } = require("../metadata/DocMetas");
const { Preconditions } = require("../Preconditions");
class PersistenceLayer {
    constructor(datastore) {
        this.datastore = datastore;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.datastore.init();
        });
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield this.datastore.getDocMeta(fingerprint);
            if (!data) {
                return null;
            }
            if (!(typeof data === "string")) {
                throw new Error("Expected string and received: " + typeof data);
            }
            return DocMetas.deserialize(data);
        });
    }
    syncDocMeta(docMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sync(docMeta.docInfo.fingerprint, docMeta);
        });
    }
    sync(fingerprint, docMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions.assertNotNull(fingerprint, "fingerprint");
            Preconditions.assertNotNull(docMeta, "docMeta");
            console.log("Sync of docMeta with fingerprint: ", fingerprint);
            if (!(docMeta instanceof DocMeta)) {
                throw new Error("Can not sync anything other than DocMeta.");
            }
            let data = DocMetas.serialize(docMeta, "  ");
            yield this.datastore.sync(fingerprint, data);
        });
    }
}
exports.PersistenceLayer = PersistenceLayer;
//# sourceMappingURL=PersistenceLayer.js.map