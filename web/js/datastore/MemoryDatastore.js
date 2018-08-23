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
const Paths_1 = require("../util/Paths");
const DiskDatastore_1 = require("./DiskDatastore");
const Datastore_1 = require("./Datastore");
const Preconditions_1 = require("../Preconditions");
class MemoryDatastore extends Datastore_1.Datastore {
    constructor() {
        super();
        this.docMetas = {};
        this.dataDir = DiskDatastore_1.DiskDatastore.getDataDir();
        this.stashDir = Paths_1.Paths.create(this.dataDir, "stash");
        this.docMetas = {};
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    getDocMeta(fingerprint) {
        return __awaiter(this, void 0, void 0, function* () {
            let nrDocs = Object.keys(this.docMetas).length;
            console.log(`Fetching document from datastore with fingerprint ${fingerprint} of ${nrDocs} docs.`);
            return this.docMetas[fingerprint];
        });
    }
    sync(fingerprint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            Preconditions_1.Preconditions.assertTypeOf(data, "string", "data");
            this.docMetas[fingerprint] = data;
        });
    }
}
exports.MemoryDatastore = MemoryDatastore;
;
//# sourceMappingURL=MemoryDatastore.js.map