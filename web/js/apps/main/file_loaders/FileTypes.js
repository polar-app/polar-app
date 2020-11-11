"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileTypes = void 0;
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
class FileTypes {
    static create(path) {
        if (FilePaths_1.FilePaths.hasExtension(path, "pdf")) {
            return 'pdf';
        }
        else if (FilePaths_1.FilePaths.hasExtension(path, "epub")) {
            return 'epub';
        }
        else {
            throw new Error("Unable to handle file: " + path);
        }
    }
}
exports.FileTypes = FileTypes;
//# sourceMappingURL=FileTypes.js.map