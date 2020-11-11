"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileImportRequests = void 0;
const AddFileRequests_1 = require("./AddFileRequests");
class FileImportRequests {
    static fromPath(path) {
        return {
            files: [
                AddFileRequests_1.AddFileRequests.fromPath(path)
            ]
        };
    }
    static fromPaths(paths) {
        const files = paths.map(path => AddFileRequests_1.AddFileRequests.fromPath(path));
        return {
            files
        };
    }
    static fromURLs(urls) {
        const files = urls.map(url => AddFileRequests_1.AddFileRequests.fromURL(url));
        return {
            files
        };
    }
}
exports.FileImportRequests = FileImportRequests;
//# sourceMappingURL=FileImportRequests.js.map