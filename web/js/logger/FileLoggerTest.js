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
const chai_1 = require("chai");
const FileLogger_1 = require("./FileLogger");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Files_1 = require("polar-shared/src/util/Files");
describe('FileLogger', function () {
    it("Basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const path = FilePaths_1.FilePaths.createTempName('file-logger-test.log');
            yield Files_1.Files.removeAsync(path);
            const fileLogger = yield FileLogger_1.FileLogger.create(path);
            chai_1.assert.ok(yield Files_1.Files.existsAsync(path));
            fileLogger.info("Hello world");
            fileLogger.info("This is an object: ", { 'hello': 'world' });
            fileLogger.info("This is a basic string: ", "basic string");
            fileLogger.error("This is an error: ", new Error("Fake error"));
            yield fileLogger.sync();
            yield fileLogger.close();
            const data = yield Files_1.Files.readFileAsync(path);
            console.log("data: ", data.toString("UTF8"));
            chai_1.assert.ok(data.indexOf("[info] Hello world") !== -1);
            chai_1.assert.ok(data.indexOf("[info] This is an object: { hello: 'world' }") !== -1);
            chai_1.assert.ok(data.indexOf("[info] This is a basic string: basic string") !== -1);
            chai_1.assert.ok(data.indexOf("[error] This is an error: \n" +
                "Error: Fake error\n" +
                "    at ") !== -1);
        });
    });
});
//# sourceMappingURL=FileLoggerTest.js.map