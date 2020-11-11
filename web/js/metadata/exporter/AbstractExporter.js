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
exports.AbstractExporter = void 0;
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
class AbstractExporter {
    init(writer, datastore) {
        return __awaiter(this, void 0, void 0, function* () {
            this.writer = writer;
            this.datastore = datastore;
        });
    }
    write(exportable) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (exportable.annotationType) {
                case AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT:
                    yield this.writeTextHighlight(exportable.original, exportable);
                    break;
                case AnnotationType_1.AnnotationType.AREA_HIGHLIGHT:
                    yield this.writeAreaHighlight(exportable.original, exportable);
                    break;
                case AnnotationType_1.AnnotationType.COMMENT:
                    yield this.writeComment(exportable.original, exportable);
                    break;
                case AnnotationType_1.AnnotationType.FLASHCARD:
                    yield this.writeFlashcard(exportable.original, exportable);
                    break;
            }
        });
    }
    close(err) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.AbstractExporter = AbstractExporter;
//# sourceMappingURL=AbstractExporter.js.map