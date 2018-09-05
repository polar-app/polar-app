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
const FilePaths_1 = require("../util/FilePaths");
const MockCapturedContent_1 = require("./MockCapturedContent");
const CapturedPHZWriter_1 = require("./CapturedPHZWriter");
require("../test/TestingTime").freeze();
describe('CapturedPHZWriter', function () {
    it("write out captured JSON", function () {
        return __awaiter(this, void 0, void 0, function* () {
            let captured = MockCapturedContent_1.MockCapturedContent.create();
            let capturedPHZWriter = new CapturedPHZWriter_1.CapturedPHZWriter(FilePaths_1.FilePaths.tmpfile("captured.phz"));
            yield capturedPHZWriter.convert(captured);
        });
    });
});
//# sourceMappingURL=CapturedPHZWriterTest.js.map