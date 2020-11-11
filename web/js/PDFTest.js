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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Files_1 = require("polar-shared/src/util/Files");
const url_1 = __importDefault(require("url"));
const pdfjs_dist_1 = __importDefault(require("pdfjs-dist"));
xdescribe('PDF', function () {
    xit("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const buffer = yield Files_1.Files.readFileAsync("/home/burton/Downloads/1010.3003v1.pdf");
            const uint8 = toArray(buffer);
            const filePath = "/home/burton/incremental-reading/.stash/The Toyota Way _ 14 Management Principles from the World's Greatest Manufac.pdf";
            if (!(yield Files_1.Files.existsAsync(filePath))) {
                throw new Error("File does not exist at path: " + filePath);
            }
            const fileURL = url_1.default.format({
                protocol: 'file',
                slashes: true,
                pathname: filePath,
            });
            const pdfLoadingTask = pdfjs_dist_1.default.getDocument(fileURL);
            const doc = yield pdfLoadingTask.promise;
            const metadata = yield doc.getMetadata();
            if (metadata.metadata && metadata.metadata.get('dc:title')) {
                console.log("FIXME !!!");
            }
            console.log("metadata: ", metadata);
            console.log("numPages: " + doc.numPages);
            console.log("fingerprint: " + doc.fingerprint);
        });
    });
});
function toArray(buf) {
    if (!buf)
        return undefined;
    if (buf.constructor.name === 'Uint8Array') {
        return buf;
    }
    if (typeof buf === 'string')
        buf = Buffer.from(buf);
    var a = new Uint8Array(buf.length);
    for (var i = 0; i < buf.length; i++)
        a[i] = buf[i];
    return a;
}
;
//# sourceMappingURL=PDFTest.js.map