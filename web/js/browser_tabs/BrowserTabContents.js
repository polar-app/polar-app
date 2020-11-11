"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserTabContents = void 0;
const react_1 = __importDefault(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const BrowserTabsStore_1 = require("./BrowserTabsStore");
const BrowserTabContent = react_1.default.memo((props) => {
    const { active } = props;
    const display = active ? 'flex' : 'none';
    return (react_1.default.createElement("div", { className: "BrowserTabContents", style: {
            display,
            minHeight: 0,
            flexDirection: 'column',
            flexGrow: 1
        } }, props.children));
}, react_fast_compare_1.default);
exports.BrowserTabContents = react_1.default.memo(() => {
    const { activeTab, tabs } = BrowserTabsStore_1.useBrowserTabsStore(['activeTab', 'tabs']);
    return (react_1.default.createElement(react_1.default.Fragment, null, tabs.map((tab, tabIndex) => tab.component &&
        react_1.default.createElement(BrowserTabContent, { key: tab.url, active: activeTab === tabIndex }, tab.component))));
});
//# sourceMappingURL=BrowserTabContents.js.map