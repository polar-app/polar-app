"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocMetaComparisonIndex = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const UUIDs_1 = require("../metadata/UUIDs");
class DocMetaComparisonIndex {
    constructor() {
        this.backing = {};
    }
    contains(fingerprint) {
        return Preconditions_1.isPresent(this.backing[fingerprint]);
    }
    get(fingerprint) {
        return this.backing[fingerprint];
    }
    remove(fingerprint) {
        delete this.backing[fingerprint];
    }
    updateUsingDocMeta(docMeta) {
        this.backing[docMeta.docInfo.fingerprint] = {
            fingerprint: docMeta.docInfo.fingerprint,
            uuid: docMeta.docInfo.uuid
        };
    }
    updateUsingDocInfo(docInfo) {
        this.backing[docInfo.fingerprint] = {
            fingerprint: docInfo.fingerprint,
            uuid: docInfo.uuid
        };
    }
    handleDocMetaMutation(docMetaMutation, docInfo) {
        const mutationType = docMetaMutation.mutationType;
        let doUpdated = false;
        const docComparison = this.get(docInfo.fingerprint);
        if (!docComparison) {
            doUpdated = true;
        }
        if (docComparison) {
            if (UUIDs_1.UUIDs.compare(docComparison.uuid, docInfo.uuid) < 0) {
                doUpdated = true;
            }
            else {
            }
        }
        if (doUpdated) {
            this.updateUsingDocInfo(docInfo);
            return true;
        }
        if (mutationType === 'deleted' && this.get(docInfo.fingerprint)) {
            this.remove(docInfo.fingerprint);
            return true;
        }
        return false;
    }
}
exports.DocMetaComparisonIndex = DocMetaComparisonIndex;
//# sourceMappingURL=DocMetaComparisonIndex.js.map