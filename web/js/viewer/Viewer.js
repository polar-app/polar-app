"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JQuery_1 = __importDefault(require("../ui/JQuery"));
class Viewer {
    start() {
        JQuery_1.default(document).ready(() => {
        });
    }
    changeScale(scale) {
        throw new Error("Not supported by this viewer.");
    }
}
exports.Viewer = Viewer;
//# sourceMappingURL=Viewer.js.map