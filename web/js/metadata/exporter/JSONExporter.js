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
exports.JSONExporter = void 0;
const AbstractExporter_1 = require("./AbstractExporter");
const Strings_1 = require("polar-shared/src/util/Strings");
class JSONExporter extends AbstractExporter_1.AbstractExporter {
    constructor() {
        super(...arguments);
        this.id = 'json';
        this.hasItem = false;
    }
    init(writer, datastore) {
        const _super = Object.create(null, {
            init: { get: () => super.init }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.init.call(this, writer, datastore);
            yield writer.write("{\n");
            yield writer.write("  \"version\": 1,\n");
            yield writer.write("  \"items\": [\n");
        });
    }
    onItem() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasItem) {
                yield this.writer.write(",\n");
            }
            this.hasItem = true;
        });
    }
    writeAreaHighlight(areaHighlight, exportable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onItem();
            yield this.writer.write(this.toRecord(areaHighlight));
        });
    }
    writeTextHighlight(textHighlight, exportable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onItem();
            yield this.writer.write(this.toRecord(textHighlight));
        });
    }
    writeComment(comment, exportable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onItem();
            yield this.writer.write(this.toRecord(comment));
        });
    }
    writeFlashcard(flashcard, exportable) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onItem();
            yield this.writer.write(this.toRecord(flashcard));
        });
    }
    close(err) {
        const _super = Object.create(null, {
            close: { get: () => super.close }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writer.write("\n  ]\n");
            yield this.writer.write("\n}\n");
            return _super.close.call(this, err);
        });
    }
    toRecord(obj) {
        return Strings_1.Strings.indent(JSON.stringify(obj, null, "  "), "    ");
    }
}
exports.JSONExporter = JSONExporter;
//# sourceMappingURL=JSONExporter.js.map