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
exports.AnimatedRoutes = void 0;
const react_router_dom_1 = require("react-router-dom");
const framer_motion_1 = require("framer-motion");
const FadeIn_1 = require("../../js/ui/motion/FadeIn");
const React = __importStar(require("react"));
const ReactRouters_1 = require("../../js/react/router/ReactRouters");
const RightSidebar_1 = require("../../js/ui/motion/RightSidebar");
const Functions_1 = require("polar-shared/src/util/Functions");
const FirstPage = () => {
    return (React.createElement(FadeIn_1.FadeIn, null,
        React.createElement("div", null, "this is the first page")));
};
const SecondPage = () => (React.createElement(FadeIn_1.FadeIn, null,
    React.createElement("div", null, "this is the second page")));
const ThirdPage = () => (React.createElement("div", null, "this is the third page just inside a basic div"));
const RightSidebarPage = () => (React.createElement(RightSidebar_1.RightSidebar, { style: { backgroundColor: 'red' }, onClose: Functions_1.NULL_FUNCTION },
    React.createElement("div", null, "this is the right sidebar")));
const AnimatedSwitch = (props) => {
    const location = react_router_dom_1.useLocation();
    const history = react_router_dom_1.useHistory();
    return (React.createElement(framer_motion_1.AnimatePresence, { exitBeforeEnter: false, initial: false, custom: { action: history.action } },
        React.createElement(react_router_dom_1.Switch, { location: ReactRouters_1.ReactRouters.createLocationWithHashOnly(), key: location.hash }, props.children)));
};
exports.AnimatedRoutes = () => {
    return (React.createElement(react_router_dom_1.BrowserRouter, { key: "browser-router" },
        React.createElement(react_router_dom_1.Link, { to: '#' }, "home"),
        React.createElement(react_router_dom_1.Link, { to: '#second' }, "second"),
        React.createElement(react_router_dom_1.Link, { to: '#third' }, "third"),
        React.createElement(react_router_dom_1.Link, { to: '#sidebar' }, "sidebar"),
        React.createElement(AnimatedSwitch, null,
            React.createElement(react_router_dom_1.Route, { exact: true, path: '#', component: FirstPage }),
            React.createElement(react_router_dom_1.Route, { exact: true, path: '#second', component: SecondPage }),
            React.createElement(react_router_dom_1.Route, { exact: true, path: '#third', component: ThirdPage }),
            React.createElement(react_router_dom_1.Route, { exact: true, path: '#sidebar', component: RightSidebarPage }))));
};
//# sourceMappingURL=AnimatedRoutes.js.map