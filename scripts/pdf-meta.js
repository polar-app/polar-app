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
const PDFMetadata_1 = require("polar-pdf/src/pdf/PDFMetadata");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const DocImporter_1 = require("../web/js/apps/repository/importers/DocImporter");
class Main {
    static main() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const path of process.argv.slice(2)) {
                console.log("====");
                console.log("Fetching PDF metadata for: " + FilePaths_1.FilePaths.resolve(path));
                const metadata = yield PDFMetadata_1.PDFMetadata.getMetadata(path);
                const hashcode = yield DocImporter_1.DocImporter.computeHashcode(path);
                console.log("fingerprint: " + metadata.fingerprint);
                console.log("nr pages: " + metadata.nrPages);
                console.log("hashcode: " + JSON.stringify(hashcode, null, "  "));
            }
        });
    }
}
Main.main()
    .catch(err => console.error("Failure to process PDF meta: ", err));
//# sourceMappingURL=pdf-meta.js.map