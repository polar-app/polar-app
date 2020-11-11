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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NavTabs = void 0;
const React = __importStar(require("react"));
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const ReactRouterLinks_1 = require("../../../web/js/ui/ReactRouterLinks");
const Tabs_1 = __importDefault(require("@material-ui/core/Tabs"));
const Functions_1 = require("polar-shared/src/util/Functions");
const Tab_1 = __importDefault(require("@material-ui/core/Tab"));
const react_router_dom_1 = require("react-router-dom");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
exports.NavTabs = React.memo((props) => {
    const location = react_router_dom_1.useLocation();
    const activeTab = ArrayStreams_1.arrayStream(props.tabs)
        .filter(tab => ReactRouterLinks_1.ReactRouterLinks.isActive(tab.link, location))
        .first();
    const activeTabID = activeTab ? activeTab.idx : false;
    return (React.createElement(Tabs_1.default, { value: activeTabID, textColor: "inherit", variant: "standard", onChange: Functions_1.NULL_FUNCTION }, props.tabs.map(tab => (React.createElement(Tab_1.default, { key: tab.idx, draggable: false, id: tab.id, disableFocusRipple: true, disableRipple: true, component: react_router_dom_1.Link, to: tab.link, label: tab.label })))));
}, react_fast_compare_1.default);
//# sourceMappingURL=NavTabs.js.map