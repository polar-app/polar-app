"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileImportClient = void 0;
const Broadcasters_1 = require("../../ipc/Broadcasters");
class FileImportClient {
    static send(fileImportRequest) {
        Broadcasters_1.Broadcasters.send('file-import', fileImportRequest);
    }
}
exports.FileImportClient = FileImportClient;
//# sourceMappingURL=FileImportClient.js.map