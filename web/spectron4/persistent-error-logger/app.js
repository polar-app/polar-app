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
const SpectronRenderer_1 = require("../../js/test/SpectronRenderer");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Logging_1 = require("../../js/logger/Logging");
const PolarDataDir_1 = require("../../js/test/PolarDataDir");
const log = Logger_1.Logger.create();
SpectronRenderer_1.SpectronRenderer.run((state) => __awaiter(void 0, void 0, void 0, function* () {
    yield PolarDataDir_1.PolarDataDir.reuseDirectory('.polar-persistent-error-logger');
    yield Logging_1.Logging.init();
    log.error("This is from the renderer process: ", new Error("Fake error in the renderer process"));
    yield log.sync();
    yield state.testResultWriter.write(true);
}));
//# sourceMappingURL=app.js.map