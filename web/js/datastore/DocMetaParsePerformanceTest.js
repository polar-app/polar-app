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
const DiskDatastore_1 = require("./DiskDatastore");
const os_1 = __importDefault(require("os"));
const Stopwatches_1 = require("polar-shared/src/util/Stopwatches");
const DocMetas_1 = require("../metadata/DocMetas");
const tmpdir = os_1.default.tmpdir();
xdescribe("DocMetaParsePerformance", function () {
    return __awaiter(this, void 0, void 0, function* () {
        xit("basic", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const datastore = new DiskDatastore_1.DiskDatastore();
                yield datastore.init();
                let stopwatch = Stopwatches_1.Stopwatches.create();
                const docMetaRefs = yield datastore.getDocMetaRefs();
                console.log("getDocMetaRefs: " + stopwatch.stop());
                console.log("Found N docMetas: " + docMetaRefs.length);
                stopwatch = Stopwatches_1.Stopwatches.create();
                for (const docMetaRef of docMetaRefs) {
                    const data = yield datastore.getDocMeta(docMetaRef.fingerprint);
                    if (data) {
                        const docMeta = DocMetas_1.DocMetas.deserialize(data, docMetaRef.fingerprint);
                    }
                }
                console.log("getDocMeta for each DocMetaRef: " + stopwatch.stop());
            });
        });
    });
});
//# sourceMappingURL=DocMetaParsePerformanceTest.js.map