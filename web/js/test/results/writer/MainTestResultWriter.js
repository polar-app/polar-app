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
exports.MainTestResultWriter = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const electron_1 = require("electron");
const Functions_1 = require("polar-shared/src/util/Functions");
const TestResult_1 = require("../renderer/TestResult");
const log = Logger_1.Logger.create();
class MainTestResultWriter {
    constructor(mainWindow) {
        this.mainWindow = mainWindow;
    }
    write(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result === null || result === undefined) {
                throw new Error("No result given!");
            }
            log.info("Writing test result: ", result);
            const browserWindows = electron_1.BrowserWindow.getAllWindows();
            for (const browserWindow of browserWindows) {
                const script = Functions_1.Functions.toScript(TestResult_1.TestResult.set, result);
                yield browserWindow.webContents.executeJavaScript(script);
            }
        });
    }
}
exports.MainTestResultWriter = MainTestResultWriter;
//# sourceMappingURL=MainTestResultWriter.js.map