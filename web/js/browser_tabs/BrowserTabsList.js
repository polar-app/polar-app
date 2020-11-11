"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserTabsList = void 0;
const react_1 = __importDefault(require("react"));
const BrowserTabsStore_1 = require("./BrowserTabsStore");
const Tabs_1 = __importDefault(require("@material-ui/core/Tabs"));
const Tab_1 = __importDefault(require("@material-ui/core/Tab"));
const react_router_dom_1 = require("react-router-dom");
const DragBar_1 = require("./DragBar");
exports.BrowserTabsList = react_1.default.memo(() => {
    const { activeTab, tabs } = BrowserTabsStore_1.useBrowserTabsStore(['activeTab', 'tabs']);
    const { setActiveTab } = BrowserTabsStore_1.useBrowserTabsCallbacks();
    const history = react_router_dom_1.useHistory();
    const handleChange = (event, tabIndex) => {
        const tab = tabs[tabIndex];
        if (tab) {
            setActiveTab(tabIndex);
            console.log("Changing navigation to: " + tab.url);
            history.replace(tab.url);
        }
        else {
            console.warn("No tab for ID: " + tabIndex);
        }
    };
    return (react_1.default.createElement("div", { style: { paddingLeft: '70px' } },
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(DragBar_1.DragBar, null),
            react_1.default.createElement(Tabs_1.default, { value: activeTab, indicatorColor: "primary", textColor: "inherit", variant: "standard", onChange: handleChange }, tabs.map((tab, tabIndex) => (react_1.default.createElement(Tab_1.default, { key: tabIndex, draggable: false, id: '' + tabIndex, disableFocusRipple: true, disableRipple: true, label: tab.title })))))));
});
//# sourceMappingURL=BrowserTabsList.js.map