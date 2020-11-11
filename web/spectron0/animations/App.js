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
exports.App = exports.RightSidebar = exports.FadeIn2 = exports.FadeIn = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const framer_motion_1 = require("framer-motion");
exports.FadeIn = (props) => {
    return (React.createElement(framer_motion_1.motion.div, { key: "fade-in-motion", initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }, props.children));
};
exports.FadeIn2 = (props) => {
    const pageVariants = {
        initial: {
            opacity: 0,
        },
        in: {
            opacity: 1,
        },
        out: {
            opacity: 0,
        }
    };
    return (React.createElement(framer_motion_1.motion.div, { key: "fade-in-2-motion", initial: "initial", animate: "in", exit: "out", variants: pageVariants }, props.children));
};
exports.RightSidebar = (props) => {
    const style = Object.assign({ position: 'absolute', right: 0, top: 0, width: '350px', height: '100%' }, props.style || {});
    return (React.createElement(framer_motion_1.motion.div, { key: "right-sidebar", initial: { right: -350 }, animate: { right: 0 }, exit: { right: -350 }, style: style }, props.children));
};
const FirstPage = () => (React.createElement(exports.FadeIn, null, "this is the first page"));
const SecondPage = () => (React.createElement(exports.FadeIn, null, "this is the second page"));
const ThirdPage = () => (React.createElement("div", null, "this is the third page just inside a basic div"));
const RightSidebarPage = () => (React.createElement(exports.RightSidebar, { style: { backgroundColor: 'red' } },
    React.createElement("div", null, "this is the left sidebar")));
const ToggleVisibilityButton = (props) => (React.createElement("button", { key: "toggle-button-impl", onClick: () => props.onClick() }, "toggle visibility"));
const ToggleFade = (props) => {
    if (props.show) {
        return (React.createElement("div", { key: "toggle-fade" },
            React.createElement(ToggleVisibilityButton, { key: "toggle-button", onClick: () => props.toggle() }),
            React.createElement(exports.FadeIn, { key: "fade-in" },
                React.createElement("div", { key: "fade-content" }, "This should fade in and out on toggle"))));
    }
    else {
        return (React.createElement("div", { key: "toggle-fade" },
            React.createElement(ToggleVisibilityButton, { key: "toggle-button", onClick: () => props.toggle() })));
    }
};
const ToggleVisibilityBroken = () => {
    const [show, toggle] = react_1.useState(true);
    return (React.createElement(framer_motion_1.AnimatePresence, null,
        React.createElement(ToggleFade, { key: "toggle-fade", show: show, toggle: () => toggle(!show) })));
};
const ToggleVisibilityWorking = () => {
    const [show, toggle] = react_1.useState(true);
    return (React.createElement("div", null,
        React.createElement(ToggleVisibilityButton, { onClick: () => toggle(!show) }),
        React.createElement(framer_motion_1.AnimatePresence, null, show && (React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
            React.createElement("div", null, "some stuff here"))))));
};
const ToggleVisibilityWorking2 = () => {
    const [show, toggle] = react_1.useState(true);
    return (React.createElement("div", null,
        React.createElement(ToggleVisibilityButton, { onClick: () => toggle(!show) }),
        React.createElement(framer_motion_1.AnimatePresence, null, show && (React.createElement("div", null,
            React.createElement(exports.FadeIn, null,
                React.createElement("div", null, "some stuff here")))))));
};
const TestPage = () => (React.createElement(exports.FadeIn, null, "test"));
function computeKey() {
    const key = location.hash;
    console.log("FIXME", { key });
    return key;
}
const RoutedPage = () => (React.createElement(react_router_dom_1.HashRouter, { key: "hash-router", hashType: "noslash", basename: "/" },
    React.createElement("div", { style: { display: 'flex' } },
        React.createElement(react_router_dom_1.Link, { to: "/" }, "home"),
        "\u00A0",
        React.createElement(react_router_dom_1.Link, { to: "/second" }, "second"),
        "\u00A0",
        React.createElement(react_router_dom_1.Link, { to: "/third" }, "third"),
        "\u00A0",
        React.createElement(react_router_dom_1.Link, { to: "/toggler" }, "toggler"),
        "\u00A0",
        React.createElement(react_router_dom_1.Link, { to: "/sidebar" }, "sidebar"),
        "\u00A0",
        React.createElement(react_router_dom_1.Link, { to: "/test" }, "test")),
    React.createElement(react_router_dom_1.Route, { render: () => (React.createElement(framer_motion_1.AnimatePresence, { exitBeforeEnter: true, initial: false },
            React.createElement(react_router_dom_1.Switch, { key: computeKey() },
                React.createElement(react_router_dom_1.Route, { key: "0", exact: true, path: '/', component: FirstPage }),
                React.createElement(react_router_dom_1.Route, { key: "1", exact: true, path: '/second', component: SecondPage }),
                React.createElement(react_router_dom_1.Route, { key: "2", exact: true, path: '/third', component: ThirdPage }),
                React.createElement(react_router_dom_1.Route, { key: "3", exact: true, path: '/toggler', component: ToggleVisibilityWorking2 }),
                React.createElement(react_router_dom_1.Route, { key: "4", exact: true, path: '/sidebar', component: RightSidebarPage }),
                React.createElement(react_router_dom_1.Route, { key: "5", exact: true, path: '/test', component: TestPage })))) })));
exports.App = () => (React.createElement("div", null,
    React.createElement(RoutedPage, null)));
//# sourceMappingURL=App.js.map