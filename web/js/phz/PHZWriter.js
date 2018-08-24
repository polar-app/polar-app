"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jszip_1 = __importDefault(require("jszip"));
const Resources_1 = require("./Resources");
const ResourceEntry_1 = require("./ResourceEntry");
const ContentTypes_1 = require("./ContentTypes");
const fs = require('fs');
class PHZWriter {
    constructor(path) {
        this.path = path;
        this.zip = new jszip_1.default();
        this.resources = new Resources_1.Resources();
    }
    writeMetadata(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            this.__write("metadata.json", JSON.stringify(metadata, null, "  "), "metadata");
            return this;
        });
    }
    writeResource(resource, content, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            if (comment === undefined) {
                comment = "";
            }
            let ext = ContentTypes_1.ContentTypes.contentTypeToExtension(resource.contentType);
            let path = `${resource.id}.${ext}`;
            const resourceEntry = new ResourceEntry_1.ResourceEntry({ id: resource.id, path, resource });
            this.resources.entries[resource.id] = resourceEntry;
            this.__write(`${resource.id}-meta.json`, JSON.stringify(resource, null, "  "), "");
            this.__write(path, content, comment);
            return this;
        });
    }
    __writeResources() {
        this.__write("resources.json", JSON.stringify(this.resources, null, "  "), "resources");
        return this;
    }
    __write(path, content, comment) {
        this.zip.file(path, content);
        return this;
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.__writeResources();
            return new Promise((resolve, reject) => {
                this.zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                    .pipe(fs.createWriteStream(this.path))
                    .on('error', function (err) {
                    reject(err);
                })
                    .on('finish', function () {
                    resolve();
                });
            });
        });
    }
}
exports.PHZWriter = PHZWriter;
//# sourceMappingURL=PHZWriter.js.map