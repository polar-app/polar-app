"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fingerprints = void 0;
const Hashcodes_1 = require("polar-shared/src/util/Hashcodes");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class Fingerprints {
    static fromFilename(filename) {
        let match = filename.match(/-([^-]+)\.[^.]+$/);
        return Preconditions_1.notNull(match)[1];
    }
    static toFilename(path, fingerprint) {
        let index = path.lastIndexOf(".");
        let prefix = path.substring(0, index);
        let suffix = path.substring(index + 1, path.length);
        return `${prefix}-${fingerprint}.${suffix}`;
    }
    static create(data) {
        return Hashcodes_1.Hashcodes.create(data).substring(0, 20);
    }
}
exports.Fingerprints = Fingerprints;
//# sourceMappingURL=Fingerprints.js.map