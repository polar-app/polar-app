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
exports.MarkdownExporter = void 0;
const AbstractExporter_1 = require("./AbstractExporter");
const Texts_1 = require("polar-shared/src/metadata/Texts");
class MarkdownExporter extends AbstractExporter_1.AbstractExporter {
    constructor() {
        super(...arguments);
        this.id = 'markdown';
    }
    pageInfoToText(pageInfo) {
        if (!pageInfo) {
            return "";
        }
        return `page: ${pageInfo.num}\n`;
    }
    writeImage(highlight) {
        return __awaiter(this, void 0, void 0, function* () {
            if (highlight.image) {
                const backend = highlight.image.src.backend;
                const fileRef = highlight.image.src;
                const containsFile = yield this.datastore.containsFile(backend, fileRef);
                if (containsFile) {
                    const file = this.datastore.getFile(backend, fileRef);
                    yield this.writer.write(`image: ${file.url}\n`);
                }
            }
        });
    }
    writeAreaHighlight(areaHighlight, exportable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writer.write("---\n");
            const output = `type: area-highlight\n` +
                `created: ${areaHighlight.created}\n` +
                `color: ${areaHighlight.color || ''}\n`;
            yield this.writer.write(output);
            yield this.writeImage(areaHighlight);
        });
    }
    writeTextHighlight(textHighlight, exportable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writer.write("---\n");
            yield this.writer.write(this.pageInfoToText(exportable.pageInfo));
            const output = `type: text-highlight\n` +
                `created: ${textHighlight.created}\n` +
                `color: ${textHighlight.color || ''}\n`;
            yield this.writer.write(output);
            yield this.writeImage(textHighlight);
            const body = Texts_1.Texts.toString(textHighlight.text);
            if (body) {
                yield this.writer.write(body);
                yield this.writer.write('\n');
            }
        });
    }
    writeComment(comment, exportable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writer.write("---\n");
            yield this.writer.write(this.pageInfoToText(exportable.pageInfo));
            const output = `type: comment\n` +
                `created: ${comment.created}\n`;
            yield this.writer.write(output);
            const body = Texts_1.Texts.toString(comment.content);
            if (body) {
                yield this.writer.write(body);
                yield this.writer.write('\n');
            }
        });
    }
    writeFlashcard(flashcard, exportable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writer.write(this.pageInfoToText(exportable.pageInfo));
            for (const fieldName of Object.keys(flashcard.fields)) {
                const output = `type: flashcard\n` +
                    `created: ${flashcard.created}\n`;
                yield this.writer.write(output);
                const field = flashcard.fields[fieldName];
                yield this.writer.write(`${fieldName}: ` + Texts_1.Texts.toString(field));
                yield this.writer.write('\n');
            }
        });
    }
}
exports.MarkdownExporter = MarkdownExporter;
//# sourceMappingURL=MarkdownExporter.js.map