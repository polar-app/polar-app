"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendFileRefs = void 0;
const Either_1 = require("../util/Either");
const Backend_1 = require("polar-shared/src/datastore/Backend");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
class BackendFileRefs {
    static toBackendFileRef(either) {
        if (!either) {
            log.warn("No 'either' param specified.");
            return undefined;
        }
        const docInfo = Either_1.Either.ofLeft(either)
            .convertLeftToRight(left => left.docInfo);
        const filename = docInfo.filename;
        if (filename) {
            const backend = docInfo.backend || Backend_1.Backend.STASH;
            const backendFileRef = {
                name: filename,
                hashcode: docInfo.hashcode,
                backend
            };
            return backendFileRef;
        }
        else {
        }
        return undefined;
    }
    static toBackendFileRefs(either) {
        const result = [];
        const fileRef = this.toBackendFileRef(either);
        const docInfo = Either_1.Either.ofLeft(either)
            .convertLeftToRight(left => left.docInfo);
        if (fileRef) {
            const backend = docInfo.backend || Backend_1.Backend.STASH;
            result.push(Object.assign(Object.assign({}, fileRef), { backend }));
        }
        const attachments = docInfo.attachments || {};
        const attachmentRefs = Object.values(attachments)
            .map(current => current.fileRef)
            .filter(current => {
            if (Preconditions_1.isPresent(current)) {
                return true;
            }
            log.warn("Doc had missing attachment data: ", docInfo.fingerprint);
            return false;
        });
        result.push(...attachmentRefs);
        return result;
    }
    static equals(b0, b1) {
        return b0.backend === b1.backend && b0.name === b1.name && b0.hashcode === b1.hashcode;
    }
}
exports.BackendFileRefs = BackendFileRefs;
//# sourceMappingURL=BackendFileRefs.js.map