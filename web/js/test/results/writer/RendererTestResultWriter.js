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
exports.RendererTestResultWriter = void 0;
const TestResult_1 = require("../renderer/TestResult");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
class RendererTestResultWriter {
    write(result) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("Got result from renderer: " + result);
            if (!Preconditions_1.isPresent(result)) {
                throw new Error("No result given!");
            }
            TestResult_1.TestResult.set(result);
        });
    }
}
exports.RendererTestResultWriter = RendererTestResultWriter;
//# sourceMappingURL=RendererTestResultWriter.js.map