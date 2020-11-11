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
const SentryBrowserLogger_1 = require("../../js/logger/SentryBrowserLogger");
SpectronRenderer_1.SpectronRenderer.run((state) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running within SpectronRenderer now.");
    const sentryBrowserLogger = new SentryBrowserLogger_1.SentryBrowserLogger();
    sentryBrowserLogger.error("This is a false error from renderer: ", new Error("Fake error from renderer"));
    yield state.testResultWriter.write(true);
}));
//# sourceMappingURL=app.js.map