"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentRouteDemo = void 0;
const react_1 = __importDefault(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const react_router_dom_1 = require("react-router-dom");
const react_router_dom_2 = require("react-router-dom");
const PersistentRoute_1 = require("./PersistentRoute");
exports.PersistentRouteDemo = react_1.default.memo(() => {
    return (react_1.default.createElement("div", null,
        "these are the persistent routes",
        react_1.default.createElement(react_router_dom_1.HashRouter, null,
            react_1.default.createElement(react_router_dom_1.Link, { to: "/hello" }, "hello"),
            react_1.default.createElement(react_router_dom_1.Link, { to: "/world" }, "world"),
            react_1.default.createElement(PersistentRoute_1.PersistentRoute, { exact: true, path: '/hello' },
                react_1.default.createElement("div", null, "this is the hello page")),
            react_1.default.createElement(react_router_dom_1.Switch, null,
                react_1.default.createElement(react_router_dom_2.Route, { exact: true, path: '/world' },
                    react_1.default.createElement("div", null, "this is the world page"))))));
}, react_fast_compare_1.default);
//# sourceMappingURL=PersistentRouteDemo.js.map