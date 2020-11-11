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
const SentryNodeLogger_1 = require("../../js/logger/SentryNodeLogger");
SpectronMain2_1.SpectronMain2.create().run((state) => __awaiter(void 0, void 0, void 0, function* () {
    const sentryLogger = new SentryNodeLogger_1.SentryNodeLogger();
    sentryLogger.error("This is a false error from main: ", new Error("Fake error from main"));
    yield state.window.loadURL(`file://${__dirname}/app.html`);
}));
//# sourceMappingURL=index.js.map