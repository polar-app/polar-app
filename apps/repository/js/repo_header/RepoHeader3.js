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
exports.RepoHeader3 = exports.RepoHeader = void 0;
const React = __importStar(require("react"));
const NavIcon_1 = require("../nav/NavIcon");
const react_router_dom_1 = require("react-router-dom");
const MUIPaperToolbar_1 = require("../../../../web/js/mui/MUIPaperToolbar");
const react_teleporter_1 = require("react-teleporter");
const RepoNavbar_1 = require("../RepoNavbar");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const Settings_1 = __importDefault(require("@material-ui/icons/Settings"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const AccountAuthButton_1 = require("../../../../web/js/ui/cloud_auth/AccountAuthButton");
const CloudConnectivityButton_1 = require("../../../../web/js/apps/repository/connectivity/CloudConnectivityButton");
const MoreActionsDropdown_1 = require("./MoreActionsDropdown");
const MUIButtonBar_1 = require("../../../../web/js/mui/MUIButtonBar");
const ChromeExtensionInstallButton_1 = require("../ChromeExtensionInstallButton");
var RepoHeader;
(function (RepoHeader) {
    RepoHeader.leftMenuTeleporter = react_teleporter_1.createTeleporter();
    RepoHeader.LeftMenuTarget = RepoHeader.leftMenuTeleporter.Target;
    RepoHeader.LeftMenu = RepoHeader.leftMenuTeleporter.Source;
    RepoHeader.rightTeleporter = react_teleporter_1.createTeleporter();
    RepoHeader.RightTarget = RepoHeader.rightTeleporter.Target;
    RepoHeader.Right = RepoHeader.rightTeleporter.Source;
    RepoHeader.leftTeleporter = react_teleporter_1.createTeleporter();
    RepoHeader.LeftTarget = RepoHeader.rightTeleporter.Target;
    RepoHeader.Left = RepoHeader.rightTeleporter.Source;
})(RepoHeader = exports.RepoHeader || (exports.RepoHeader = {}));
const Handheld = () => {
    return (React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { borderBottom: true, padding: 1 },
        React.createElement("div", { style: { display: 'flex' } },
            React.createElement("div", { className: "mr-1", style: {
                    flexGrow: 1,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                } },
                React.createElement(RepoHeader.LeftMenuTarget, null),
                React.createElement("div", { className: "" },
                    React.createElement(NavIcon_1.NavIcon, null)),
                React.createElement(RepoHeader.LeftTarget, null)),
            React.createElement("div", { className: "mt-auto mb-auto", style: {
                    display: 'flex'
                } },
                React.createElement(RepoHeader.RightTarget, null),
                React.createElement(react_router_dom_1.Link, { to: { hash: 'account' } })))));
};
const Desktop = () => {
    const SettingsButton = React.memo(() => {
        return (React.createElement(react_router_dom_1.Link, { to: "/settings" },
            React.createElement(IconButton_1.default, null,
                React.createElement(Settings_1.default, null))));
    });
    return (React.createElement(MUIPaperToolbar_1.MUIPaperToolbar, { borderBottom: true, padding: 1 },
        React.createElement("div", { className: "", style: {
                display: 'flex',
                flexWrap: 'nowrap',
            } },
            React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                React.createElement(RepoNavbar_1.RepoNavbar, null)),
            React.createElement("div", { style: {
                    flexGrow: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    flexWrap: 'nowrap',
                } },
                React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                    React.createElement(ChromeExtensionInstallButton_1.ChromeExtensionInstallButton, null),
                    React.createElement(CloudConnectivityButton_1.CloudConnectivityButton, null),
                    React.createElement(AccountAuthButton_1.AccountAuthButton, null),
                    React.createElement(SettingsButton, null),
                    React.createElement(MoreActionsDropdown_1.MoreActionsDropdown, null))))));
};
exports.RepoHeader3 = React.memo(() => {
    return React.createElement(DeviceRouter_1.DeviceRouter, { handheld: React.createElement(Handheld, null), desktop: React.createElement(Desktop, null) });
});
//# sourceMappingURL=RepoHeader3.js.map