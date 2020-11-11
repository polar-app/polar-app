"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronUserAgents = void 0;
class ElectronUserAgents {
    static computeUserAgentFromWebContents(webContents) {
        return this.computeUserAgentFromString(webContents.userAgent);
    }
    static computeUserAgentFromString(userAgent) {
        userAgent = userAgent.replace(/Electron\/[0-9.]+ /, '');
        userAgent = userAgent.replace(/polar-bookshelf\/[0-9.]+ /, '');
        return userAgent;
    }
}
exports.ElectronUserAgents = ElectronUserAgents;
//# sourceMappingURL=ElectronUserAgents.js.map