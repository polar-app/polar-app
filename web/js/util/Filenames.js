"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filenames = void 0;
class Filenames {
    static sanitize(filename) {
        return filename.replace(/[^a-zA-Z0-9_]/gi, '_');
    }
}
exports.Filenames = Filenames;
//# sourceMappingURL=Filenames.js.map