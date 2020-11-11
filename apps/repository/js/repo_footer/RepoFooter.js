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
exports.RepoFooter = void 0;
const React = __importStar(require("react"));
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const BottomNavigation_1 = __importDefault(require("@material-ui/core/BottomNavigation"));
const BottomNavigationAction_1 = __importDefault(require("@material-ui/core/BottomNavigationAction"));
const Home_1 = __importDefault(require("@material-ui/icons/Home"));
const Note_1 = __importDefault(require("@material-ui/icons/Note"));
const Settings_1 = __importDefault(require("@material-ui/icons/Settings"));
const react_router_dom_1 = require("react-router-dom");
const ShowChart_1 = __importDefault(require("@material-ui/icons/ShowChart"));
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const MUIPaperToolbar_1 = require("../../../../web/js/mui/MUIPaperToolbar");
const navLinks = [
    {
        label: "Home",
        icon: React.createElement(Home_1.default, null),
        link: {
            pathname: "/"
        }
    },
    {
        label: "Annotations",
        icon: React.createElement(Note_1.default, null),
        link: {
            pathname: "/annotations"
        }
    },
    {
        label: "Stats",
        icon: React.createElement(ShowChart_1.default, null),
        link: {
            pathname: "/stats"
        }
    },
    {
        label: "Settings",
        icon: React.createElement(Settings_1.default, null),
        link: {
            pathname: "/settings"
        }
    },
];
const BottomNav = () => {
    const history = react_router_dom_1.useHistory();
    const location = react_router_dom_1.useLocation();
    function pushHistory(pathname) {
        history.push({ pathname });
    }
    function computeValue() {
        const activeNavLink = ArrayStreams_1.arrayStream(navLinks)
            .withIndex()
            .filter((current, idx) => current.value.link.pathname === location.pathname)
            .first();
        return activeNavLink === null || activeNavLink === void 0 ? void 0 : activeNavLink.index;
    }
    const value = computeValue();
    return (React.createElement(BottomNavigation_1.default, { color: "secondary", value: value, showLabels: true, style: {
            display: 'flex'
        } }, navLinks.map((current, idx) => React.createElement(BottomNavigationAction_1.default, { key: idx, label: current.label, onClick: () => pushHistory(current.link.pathname), icon: current.icon }))));
};
exports.RepoFooter = () => {
    const style = {
        width: '100%',
    };
    const BottomSheet = React.createElement("footer", { className: "border-top text-lg", style: style },
        React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { borderTop: true },
            React.createElement(BottomNav, null)));
    return (React.createElement(DeviceRouter_1.DeviceRouter, { handheld: BottomSheet }));
};
//# sourceMappingURL=RepoFooter.js.map