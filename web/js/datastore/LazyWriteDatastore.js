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
exports.LazyWriteDatastore = void 0;
const DelegatedDatastore_1 = require("./DelegatedDatastore");
const DatastoreMutation_1 = require("./DatastoreMutation");
const DocMetaComparisonIndex_1 = require("./DocMetaComparisonIndex");
const UUIDs_1 = require("../metadata/UUIDs");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class LazyWriteDatastore extends DelegatedDatastore_1.DelegatedDatastore {
    constructor(delegate) {
        super(delegate);
        this.index = new DocMetaComparisonIndex_1.DocMetaComparisonIndex();
        this.nrWrites = 0;
        this.id = 'lazy-write:' + delegate.id;
    }
    writeDocMeta(docMeta, datastoreMutation = new DatastoreMutation_1.DefaultDatastoreMutation()) {
        const _super = Object.create(null, {
            writeDocMeta: { get: () => super.writeDocMeta }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.handleWrite(docMeta.docInfo, () => __awaiter(this, void 0, void 0, function* () { return yield _super.writeDocMeta.call(this, docMeta, datastoreMutation); }));
            return docMeta.docInfo;
        });
    }
    write(fingerprint, data, docInfo, opts) {
        const _super = Object.create(null, {
            write: { get: () => super.write }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return this.handleWrite(docInfo, () => __awaiter(this, void 0, void 0, function* () { return yield _super.write.call(this, fingerprint, data, docInfo, opts); }));
        });
    }
    handleWrite(docInfo, writeFunction) {
        return __awaiter(this, void 0, void 0, function* () {
            let doUpdated = false;
            if (!this.index.contains(docInfo.fingerprint)) {
                doUpdated = true;
            }
            const docComparison = this.index.get(docInfo.fingerprint);
            if (!docComparison) {
                doUpdated = true;
            }
            if (docComparison && UUIDs_1.UUIDs.compare(docComparison.uuid, docInfo.uuid) < 0) {
                doUpdated = true;
            }
            const writeDesc = `fingerprint: ${docInfo.fingerprint}, uuid: ${docInfo.uuid}: ` + docInfo.title;
            if (doUpdated) {
                this.index.updateUsingDocInfo(docInfo);
                ++this.nrWrites;
                log.info("Performing write: " + writeDesc);
                yield writeFunction();
                return;
            }
            log.info("Skipping write: " + writeDesc);
        });
    }
    delete(docMetaFileRef) {
        this.index.remove(docMetaFileRef.fingerprint);
        return super.delete(docMetaFileRef);
    }
}
exports.LazyWriteDatastore = LazyWriteDatastore;
//# sourceMappingURL=LazyWriteDatastore.js.map