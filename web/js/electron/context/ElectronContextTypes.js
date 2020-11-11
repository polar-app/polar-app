"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronContextTypes = void 0;
const electron_1 = require("electron");
const ElectronContextType_1 = require("./ElectronContextType");
class ElectronContextTypes {
    static create() {
        if (electron_1.remote) {
            return ElectronContextType_1.ElectronContextType.RENDERER;
        }
        else {
            return ElectronContextType_1.ElectronContextType.MAIN;
        }
    }
}
exports.ElectronContextTypes = ElectronContextTypes;
//# sourceMappingURL=ElectronContextTypes.js.map