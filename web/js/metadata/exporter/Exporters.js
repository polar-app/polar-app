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
exports.Exporters = void 0;
const MarkdownExporter_1 = require("./MarkdownExporter");
const JSONExporter_1 = require("./JSONExporter");
const AnnotationHolders_1 = require("polar-shared/src/metadata/AnnotationHolders");
const BlobWriter_1 = require("./writers/BlobWriter");
const FileSavers_1 = require("polar-file-saver/src/FileSavers");
class Exporters {
    static doExportFromDocMeta(datastoreProvider, format, docMeta) {
        return __awaiter(this, void 0, void 0, function* () {
            const annotations = AnnotationHolders_1.AnnotationHolders.fromDocMeta(docMeta);
            yield this.doExportForAnnotations(datastoreProvider, annotations, format);
        });
    }
    static doExportForAnnotations(datastoreProvider, annotations, format) {
        return __awaiter(this, void 0, void 0, function* () {
            const createType = () => {
                switch (format) {
                    case 'markdown':
                        return "text/markdown;charset=utf-8";
                    case 'json':
                        return "application/json;charset=utf-8";
                    case 'html':
                        throw new Error("not supported yet");
                }
            };
            const createExt = () => {
                switch (format) {
                    case 'markdown':
                        return "md";
                    case 'json':
                        return "json";
                    case 'html':
                        throw new Error("not supported yet");
                }
            };
            const type = createType();
            const writer = new BlobWriter_1.BlobWriter();
            const datastore = datastoreProvider();
            yield this.doExport(writer, datastore, format, annotations);
            const blob = writer.toBlob(type);
            const ext = createExt();
            const ts = new Date().getTime();
            const filename = `annotations-${ts}.${ext}`;
            FileSavers_1.FileSavers.saveAs(blob, filename);
        });
    }
    static doExport(writer, datastore, format, annotations) {
        return __awaiter(this, void 0, void 0, function* () {
            yield writer.init();
            const exporter = this.create(format);
            yield exporter.init(writer, datastore);
            annotations = [...annotations]
                .sort((a, b) => a.original.created.localeCompare(b.original.created));
            for (const annotation of annotations) {
                yield exporter.write(annotation);
            }
            yield exporter.close();
        });
    }
    static create(format) {
        switch (format) {
            case 'markdown':
                return new MarkdownExporter_1.MarkdownExporter();
            case 'json':
                return new JSONExporter_1.JSONExporter();
            case 'html':
                throw new Error("not supported yet");
        }
    }
}
exports.Exporters = Exporters;
//# sourceMappingURL=Exporters.js.map