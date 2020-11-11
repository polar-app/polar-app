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
const SpectronMain2_1 = require("../../js/test/SpectronMain2");
const Logger_1 = require("polar-shared/src/logger/Logger");
const chai_1 = require("chai");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Files_1 = require("polar-shared/src/util/Files");
const Logging_1 = require("../../js/logger/Logging");
const PolarDataDir_1 = require("../../js/test/PolarDataDir");
const log = Logger_1.Logger.create();
SpectronMain2_1.SpectronMain2.create().run((state) => __awaiter(void 0, void 0, void 0, function* () {
    yield PolarDataDir_1.PolarDataDir.reuseDirectory('.polar-persistent-error-logger');
    chai_1.assert.ok(PolarDataDir_1.PolarDataDir.get(), "There is no POLAR_DATA_DIR defined");
    const path = FilePaths_1.FilePaths.join(PolarDataDir_1.PolarDataDir.get(), "logs", "error.log");
    chai_1.assert.ok(!(yield Files_1.Files.existsAsync(path)), "File still exists for some reason: " + path);
    yield Logging_1.Logging.init();
    chai_1.assert.ok(yield Files_1.Files.existsAsync(path), "The error.log file does not exist at: " + path);
    yield state.window.loadURL(`file://${__dirname}/app.html`);
    log.error("This is from the main process: ", new Error("Fake error in main process"));
    yield log.sync();
}));
//# sourceMappingURL=index.js.map