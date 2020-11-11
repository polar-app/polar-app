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
exports.DocMetadata = void 0;
const PDFMetadata_1 = require("polar-pdf/src/pdf/PDFMetadata");
const EPUBMetadata_1 = require("polar-epub/src/EPUBMetadata");
var DocMetadata;
(function (DocMetadata) {
    function getMetadata(docPath, fileType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (fileType === 'pdf') {
                return yield PDFMetadata_1.PDFMetadata.getMetadata(docPath);
            }
            else if (fileType === 'epub') {
                return yield EPUBMetadata_1.EPUBMetadata.getMetadata(docPath);
            }
            throw new Error("Invalid type: " + fileType);
        });
    }
    DocMetadata.getMetadata = getMetadata;
})(DocMetadata = exports.DocMetadata || (exports.DocMetadata = {}));
//# sourceMappingURL=DocMetadata.js.map