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
const electron = require('electron');
const Logger = require("../logger/Logger").Logger;
const ipcRenderer = electron.ipcRenderer;
const log = Logger.create();
class Screenshots {
    static capture(target) {
        return __awaiter(this, void 0, void 0, function* () {
            let rect;
            if (target instanceof HTMLElement) {
                rect = target.getBoundingClientRect();
            }
            else {
                rect = target;
            }
            return ipcRenderer.sendSync('create-screenshot', { rect });
        });
    }
}
exports.Screenshots = Screenshots;
//# sourceMappingURL=Screenshots.js.map