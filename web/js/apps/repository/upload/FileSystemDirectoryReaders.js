"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemDirectoryReaders = void 0;
var FileSystemDirectoryReaders;
(function (FileSystemDirectoryReaders) {
    function toAsync(reader) {
        return {
            readEntries: () => {
                return new Promise((resolve, reject) => {
                    reader.readEntries(result => resolve(result), err => reject(err));
                });
            }
        };
    }
    FileSystemDirectoryReaders.toAsync = toAsync;
})(FileSystemDirectoryReaders = exports.FileSystemDirectoryReaders || (exports.FileSystemDirectoryReaders = {}));
//# sourceMappingURL=FileSystemDirectoryReaders.js.map