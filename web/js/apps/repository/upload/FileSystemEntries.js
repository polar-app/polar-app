"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystemEntries = void 0;
const FileSystemDirectoryReaders_1 = require("./FileSystemDirectoryReaders");
var FileSystemEntries;
(function (FileSystemEntries) {
    function isFile(entry) {
        return entry.isFile;
    }
    FileSystemEntries.isFile = isFile;
    function isDirectory(entry) {
        return entry.isDirectory;
    }
    FileSystemEntries.isDirectory = isDirectory;
    function recurseDataTransferItems(items) {
        return __awaiter(this, void 0, void 0, function* () {
            return recurseFileSystemEntries(items.map(item => item.webkitGetAsEntry()));
        });
    }
    FileSystemEntries.recurseDataTransferItems = recurseDataTransferItems;
    function recurseFileSystemEntries(entries) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            for (const entry of entries) {
                if (entry.isFile) {
                    result.push(entry);
                }
                else if (FileSystemEntries.isDirectory(entry)) {
                    const reader = entry.createReader();
                    const asyncReader = FileSystemDirectoryReaders_1.FileSystemDirectoryReaders.toAsync(reader);
                    while (true) {
                        const dirEntries = yield asyncReader.readEntries();
                        if (dirEntries.length === 0) {
                            break;
                        }
                        const recursedEntries = yield recurseFileSystemEntries(dirEntries);
                        result.push(...recursedEntries);
                    }
                }
            }
            return result;
        });
    }
    FileSystemEntries.recurseFileSystemEntries = recurseFileSystemEntries;
})(FileSystemEntries = exports.FileSystemEntries || (exports.FileSystemEntries = {}));
//# sourceMappingURL=FileSystemEntries.js.map