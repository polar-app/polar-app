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
const MockCapturedContent_1 = require("../capture/MockCapturedContent");
const CapturedPHZWriter_1 = require("../capture/CapturedPHZWriter");
class MockPHZWriter {
    static write(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let captured = MockCapturedContent_1.MockCapturedContent.create();
            let capturedPHZWriter = new CapturedPHZWriter_1.CapturedPHZWriter(path);
            yield capturedPHZWriter.convert(captured);
        });
    }
}
exports.MockPHZWriter = MockPHZWriter;
//# sourceMappingURL=MockPHZWriter.js.map