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
exports.RepoNavbar = void 0;
const React = __importStar(require("react"));
const NavLogo_1 = require("./nav/NavLogo");
const DeviceRouter_1 = require("../../../web/js/ui/DeviceRouter");
const NavTabs_1 = require("./NavTabs");
const Grid_1 = __importDefault(require("@material-ui/core/Grid"));
const TABS = [
    {
        id: "nav-tab-document-repository",
        label: "Documents",
        link: { pathname: "/" },
    },
    {
        id: "nav-tab-annotations",
        label: "Annotations",
        link: { pathname: "/annotations" },
    },
    {
        id: "nav-tab-statistics",
        label: "Statistics",
        link: { pathname: "/stats" },
    }
].map((current, index) => (Object.assign(Object.assign({}, current), { idx: index })));
const Styles = {
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'var(--primary-background-color)',
        zIndex: 99999,
        height: 'calc(100%)',
    },
    subheader: {
        display: 'table'
    },
    subheaderItem: {}
};
class RepoNavbar extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            expanded: false
        };
    }
    render() {
        const display = this.state.expanded ? 'block' : 'none';
        const sidebarStyle = Object.assign({}, Styles.sidebar, { display });
        const Nav = () => {
            const Delegate = React.createElement("div", { className: "mt-auto mb-auto" },
                React.createElement("div", null,
                    React.createElement(NavTabs_1.NavTabs, { tabs: TABS })));
            return React.createElement(DeviceRouter_1.DeviceRouter, { desktop: Delegate });
        };
        const NavFirstRow = () => (React.createElement(Grid_1.default, { spacing: 2, container: true, direction: "row", justify: "flex-start", style: {
                flexWrap: 'nowrap'
            }, alignItems: "center" },
            React.createElement(Grid_1.default, { item: true },
                React.createElement(NavLogo_1.NavLogo, null)),
            React.createElement(Grid_1.default, { item: true },
                React.createElement(Nav, null))));
        return (React.createElement("div", { className: "repo-sidebar" },
            React.createElement(NavFirstRow, null),
            React.createElement("section", { className: "sidebar", style: sidebarStyle, "data-expanded": this.state.expanded },
                React.createElement("div", { className: "subheader", style: Styles.subheader },
                    React.createElement(NavFirstRow, null)))));
    }
}
exports.RepoNavbar = RepoNavbar;
//# sourceMappingURL=RepoNavbar.js.map