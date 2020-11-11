"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemFileEntries = void 0;
var FileSystemFileEntries;
(function (FileSystemFileEntries) {
    function toAsync(entry) {
        return {
            isFile: entry.isFile,
            isDirectory: entry.isDirectory,
            fullPath: entry.fullPath,
            name: entry.name,
            toURL: entry.toURL,
            file: () => {
                return new Promise((resolve, reject) => {
                    entry.file(result => resolve(result), err => reject(err));
                });
            }
        };
    }
    FileSystemFileEntries.toAsync = toAsync;
})(FileSystemFileEntries = exports.FileSystemFileEntries || (exports.FileSystemFileEntries = {}));
//# sourceMappingURL=FileSystemFileEntries.js.map