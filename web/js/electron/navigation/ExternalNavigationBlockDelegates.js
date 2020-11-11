"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalNavigationBlockDelegates = void 0;
const electron_1 = require("electron");
const ExternalNavigationBlock_1 = require("./ExternalNavigationBlock");
const ExternalNavigationBlockDelegate_1 = require("./ExternalNavigationBlockDelegate");
const AppRuntime_1 = require("../../AppRuntime");
class ExternalNavigationBlockDelegates {
    static get() {
        if (AppRuntime_1.AppRuntime.isElectron()) {
            const runtime = AppRuntime_1.AppRuntime.get();
            if (runtime === 'electron-renderer') {
                return electron_1.remote.getGlobal("externalNavigationBlock");
            }
            else if (runtime === 'electron-main') {
                return global.externalNavigationBlock;
            }
            else {
                return new ExternalNavigationBlock_1.NullExternalNavigationBlock();
            }
        }
        else {
            return new ExternalNavigationBlock_1.NullExternalNavigationBlock();
        }
    }
    static init() {
        global.externalNavigationBlock = new ExternalNavigationBlockDelegate_1.ExternalNavigationBlockDelegate();
    }
}
exports.ExternalNavigationBlockDelegates = ExternalNavigationBlockDelegates;
//# sourceMappingURL=ExternalNavigationBlockDelegates.js.map