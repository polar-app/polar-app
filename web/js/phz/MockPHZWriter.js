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
exports.MockPHZWriter = void 0;
const MockCapturedContent_1 = require("polar-content-capture/src/phz/MockCapturedContent");
const CapturedPHZWriter_1 = require("polar-content-capture/src/phz/CapturedPHZWriter");
const PHZWriter_1 = require("polar-content-capture/src/phz/PHZWriter");
class MockPHZWriter {
    static write(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const captured = MockCapturedContent_1.MockCapturedContent.create();
            const output = new PHZWriter_1.PHZWriter(path);
            const capturedPHZWriter = new CapturedPHZWriter_1.CapturedPHZWriter(output);
            yield capturedPHZWriter.convert(captured);
        });
    }
}
exports.MockPHZWriter = MockPHZWriter;
//# sourceMappingURL=MockPHZWriter.js.map