"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatastoreFiles = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
class DatastoreFiles {
    static isValidFileName(name) {
        return name.search(/^[a-zA-Z0-9_(),{} -]+(\.[a-zA-Z0-9]{3,4})?$/g) !== -1;
    }
    static assertValidFileName(ref) {
        if (!this.isValidFileName(ref.name)) {
            throw new Error("Invalid file name: " + ref.name);
        }
    }
    static sanitizeFileName(name) {
        return name.replace(/[/\\:*?\"<>|]/g, '_');
    }
    static isSanitizedFileName(name) {
        Preconditions_1.Preconditions.assertPresent(name, "name");
        return name.search(/[/\\:*?\"<>|]/) === -1;
    }
    static assertSanitizedFileName(ref) {
        if (!this.isSanitizedFileName(ref.name)) {
            throw new Error("Invalid file name: " + ref.name);
        }
    }
}
exports.DatastoreFiles = DatastoreFiles;
//# sourceMappingURL=DatastoreFiles.js.map