"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Filenames {
    static sanitize(filename) {
        return filename.replace(/[^a-z0-9_]/gi, '_');
    }
}
exports.Filenames = Filenames;
//# sourceMappingURL=Filenames.js.map