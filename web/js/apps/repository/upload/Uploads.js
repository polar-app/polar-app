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
exports.Uploads = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const UploadPaths_1 = require("./UploadPaths");
const Tags_1 = require("polar-shared/src/tags/Tags");
const FileSystemFileEntries_1 = require("./FileSystemFileEntries");
const AsyncArrayStreams_1 = require("polar-shared/src/util/AsyncArrayStreams");
var Uploads;
(function (Uploads) {
    function isFileWithWebkitRelativePath(file) {
        return Preconditions_1.isPresent(file.webkitRelativePath);
    }
    function computeTagsFromPath(filePath) {
        if (!filePath) {
            return undefined;
        }
        const path = UploadPaths_1.UploadPaths.parse(filePath);
        if (!path) {
            return undefined;
        }
        return [
            Tags_1.Tags.create('/' + path)
        ];
    }
    function fromFileSystemEntries(entries) {
        return __awaiter(this, void 0, void 0, function* () {
            function toUpload(entry) {
                return __awaiter(this, void 0, void 0, function* () {
                    const asyncEntry = FileSystemFileEntries_1.FileSystemFileEntries.toAsync(entry);
                    function computeTags() {
                        return computeTagsFromPath(entry.fullPath);
                    }
                    const tags = computeTags();
                    const file = yield asyncEntry.file();
                    return {
                        blob: () => __awaiter(this, void 0, void 0, function* () { return file; }),
                        name: entry.name,
                        path: entry.fullPath,
                        tags
                    };
                });
            }
            return yield AsyncArrayStreams_1.asyncStream(entries)
                .map(toUpload)
                .collect();
        });
    }
    Uploads.fromFileSystemEntries = fromFileSystemEntries;
    function fromFiles(files) {
        function toUpload(file) {
            function computeRelativePath() {
                if (isFileWithWebkitRelativePath(file)) {
                    return file.webkitRelativePath;
                }
                return undefined;
            }
            function computeTags() {
                return computeTagsFromPath(relativePath);
            }
            const relativePath = computeRelativePath();
            const tags = computeTags();
            return {
                blob: () => __awaiter(this, void 0, void 0, function* () { return file; }),
                name: file.name,
                path: relativePath,
                tags
            };
        }
        files = Array.from(files || []);
        return files.map(toUpload);
    }
    Uploads.fromFiles = fromFiles;
})(Uploads = exports.Uploads || (exports.Uploads = {}));
//# sourceMappingURL=Uploads.js.map