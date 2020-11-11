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
exports.PersistentRoute = exports.usePersistentRouteContext = void 0;
const react_router_dom_1 = require("react-router-dom");
const React = __importStar(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const ReactLifecycleHooks_1 = require("../../hooks/ReactLifecycleHooks");
const ReactUtils_1 = require("../../react/ReactUtils");
const MountListener = React.memo((props) => {
    ReactLifecycleHooks_1.useComponentDidMount(() => props.onMounted(true));
    ReactLifecycleHooks_1.useComponentWillUnmount(() => props.onMounted(false));
    return null;
}, react_fast_compare_1.default);
const PersistentRouteContext = React.createContext({ active: true });
function usePersistentRouteContext() {
    return React.useContext(PersistentRouteContext);
}
exports.usePersistentRouteContext = usePersistentRouteContext;
exports.PersistentRoute = ReactUtils_1.deepMemo((props) => {
    const [active, setActive] = React.useState(false);
    const display = active ? 'flex' : 'none';
    return (React.createElement(React.Fragment, null,
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { path: "/" },
                React.createElement("div", { className: "PersistentRoute", style: {
                        display,
                        minHeight: 0,
                        flexDirection: 'column',
                        flexGrow: 1
                    } }, props.children))),
        React.createElement(react_router_dom_1.Switch, null,
            React.createElement(react_router_dom_1.Route, { exact: true, path: props.path },
                React.createElement(MountListener, { onMounted: setActive })))));
});
//# sourceMappingURL=PersistentRoute.js.map