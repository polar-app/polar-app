"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronRendererContext = exports.ElectronMainContext = exports.ElectronContextType = void 0;
var ElectronContextType;
(function (ElectronContextType) {
    ElectronContextType[ElectronContextType["MAIN"] = 0] = "MAIN";
    ElectronContextType[ElectronContextType["RENDERER"] = 1] = "RENDERER";
})(ElectronContextType = exports.ElectronContextType || (exports.ElectronContextType = {}));
class ElectronMainContext {
    constructor() {
        this.type = ElectronContextType.MAIN;
    }
}
exports.ElectronMainContext = ElectronMainContext;
class ElectronRendererContext {
    constructor(windowReference) {
        this.type = ElectronContextType.RENDERER;
        this.windowReference = windowReference;
    }
}
exports.ElectronRendererContext = ElectronRendererContext;
//# sourceMappingURL=ElectronContext.js.map