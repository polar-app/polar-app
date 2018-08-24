"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PHZWriter_1 = require("../phz/PHZWriter");
const Functions_1 = require("../util/Functions");
const ResourceFactory_1 = require("../phz/ResourceFactory");
const Objects_1 = require("../util/Objects");
class CapturedPHZWriter {
    constructor(path) {
        this.path = path;
    }
    convert(captured) {
        return __awaiter(this, void 0, void 0, function* () {
            let phzWriter = new PHZWriter_1.PHZWriter(this.path);
            let metadata = CapturedPHZWriter.toMetadata(captured);
            yield Functions_1.forOwnKeys(captured.capturedDocuments, (url, capturedDocument) => __awaiter(this, void 0, void 0, function* () {
                let resource = ResourceFactory_1.ResourceFactory.create(capturedDocument.url, "text/html");
                resource.title = capturedDocument.title;
                yield phzWriter.writeResource(resource, capturedDocument.content, capturedDocument.url);
            }));
            yield phzWriter.writeMetadata(metadata);
            yield phzWriter.close();
        });
    }
    static toMetadata(captured) {
        let metadata = Objects_1.Objects.duplicate(captured);
        delete metadata.content;
        delete metadata.capturedDocuments;
        return metadata;
    }
}
exports.CapturedPHZWriter = CapturedPHZWriter;
//# sourceMappingURL=CapturedPHZWriter.js.map