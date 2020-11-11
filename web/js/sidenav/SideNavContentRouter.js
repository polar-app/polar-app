"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SideNavContentRouter = void 0;
const React = __importStar(require("react"));
const SideNavStore_1 = require("./SideNavStore");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const PersistentRoute_1 = require("../apps/repository/PersistentRoute");
exports.SideNavContentRouter = React.memo(() => {
    const { tabs, activeTab } = SideNavStore_1.useSideNavStore(['tabs', 'activeTab']);
    const tab = Arrays_1.Arrays.first(tabs.filter(tab => tab.id === activeTab));
    if (!tab) {
        return null;
    }
    return (React.createElement(PersistentRoute_1.PersistentRoute, { exact: true, path: tab.url },
        React.createElement(React.Fragment, null, tab.content)));
});
//# sourceMappingURL=SideNavContentRouter.js.map