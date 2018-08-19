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
const electron_1 = require("electron");
const IXYRects_1 = require("../util/rects/IXYRects");
class Screenshots {
    static capture(target) {
        return __awaiter(this, void 0, void 0, function* () {
            let rect;
            if (target instanceof HTMLElement) {
                rect = IXYRects_1.IXYRects.createFromClientRect(target.getBoundingClientRect());
            }
            else {
                rect = target;
            }
            let screenshotRequest = {
                rect
            };
            return yield electron_1.ipcRenderer.sendSync('create-screenshot', screenshotRequest);
        });
    }
}
exports.Screenshots = Screenshots;
//# sourceMappingURL=Screenshots.js.map