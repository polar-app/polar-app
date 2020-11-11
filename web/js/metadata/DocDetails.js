"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocDetails = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class DocDetails {
    static merge(docInfo, docDetail) {
        if (docDetail !== undefined) {
            log.debug("Merging docDetail: ", docDetail);
            const targetDocDetails = docInfo;
            const typedKeys = ['title', 'subtitle', 'description', 'url', 'filename'];
            const sourceDocDetails = docDetail;
            typedKeys.forEach(typedKey => {
                if (!Preconditions_1.isPresent(targetDocDetails[typedKey]) && Preconditions_1.isPresent(sourceDocDetails[typedKey])) {
                    const newValue = sourceDocDetails[typedKey];
                    log.debug(`Setting ${typedKey} to ${newValue}`);
                    targetDocDetails[typedKey] = newValue;
                }
            });
            return targetDocDetails;
        }
        else {
            log.warn("No docDetail to merge");
        }
        return undefined;
    }
}
exports.DocDetails = DocDetails;
//# sourceMappingURL=DocDetails.js.map