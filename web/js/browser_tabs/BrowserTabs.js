"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserTabs = void 0;
const react_1 = __importDefault(require("react"));
const BrowserTabsList_1 = require("./BrowserTabsList");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const BrowserTabContents_1 = require("./BrowserTabContents");
exports.BrowserTabs = react_1.default.memo((props) => {
    if (!AppRuntime_1.AppRuntime.isElectron()) {
        return props.children;
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(BrowserTabsList_1.BrowserTabsList, null),
        react_1.default.createElement(BrowserTabContents_1.BrowserTabContents, null),
        props.children));
});
//# sourceMappingURL=BrowserTabs.js.map