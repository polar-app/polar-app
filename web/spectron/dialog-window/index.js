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
const SpectronMain_1 = require("../../js/test/SpectronMain");
const DialogWindow_1 = require("../../js/ui/dialog_window/DialogWindow");
let windowFactory = () => __awaiter(this, void 0, void 0, function* () {
    let resource = new DialogWindow_1.Resource(DialogWindow_1.ResourceType.FILE, __dirname + "/app.html");
    let dialogWindow = yield DialogWindow_1.DialogWindow.create(new DialogWindow_1.DialogWindowOptions(resource));
    dialogWindow.window.webContents.toggleDevTools();
    return dialogWindow.window;
});
let options = new SpectronMain_1.SpectronMainOptions(windowFactory);
SpectronMain_1.SpectronMain.run((state) => __awaiter(this, void 0, void 0, function* () {
    yield state.testResultWriter.write(true);
}), options);
//# sourceMappingURL=index.js.map