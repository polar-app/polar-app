"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const Files_1 = require("./Files");
describe('Files', function () {
    describe('writeFileAsync', function () {
        it("basic", function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield Files_1.Files.writeFileAsync("/tmp/write-file-async.txt", "hello world");
            });
        });
    });
    describe('readFileAsync', function () {
        it("basic", function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield Files_1.Files.writeFileAsync("/tmp/write-file-async.txt", "hello world");
                let data = yield Files_1.Files.readFileAsync("/tmp/write-file-async.txt");
                assert_1.default.equal(data, "hello world");
            });
        });
    });
});
//# sourceMappingURL=FilesTest.js.map