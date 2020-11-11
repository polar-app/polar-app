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
exports.MoreActionsDropdown = void 0;
const MUIMenu_1 = require("../../../../web/js/mui/menu/MUIMenu");
const MUIMenuItem_1 = require("../../../../web/js/mui/menu/MUIMenuItem");
const React = __importStar(require("react"));
const MoreVert_1 = __importDefault(require("@material-ui/icons/MoreVert"));
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const AnkiSyncClient_1 = require("../../../../web/js/controller/AnkiSyncClient");
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const Nav_1 = require("../../../../web/js/ui/util/Nav");
const Sync_1 = __importDefault(require("@material-ui/icons/Sync"));
const LibraryBooks_1 = __importDefault(require("@material-ui/icons/LibraryBooks"));
const MUIFontAwesome_1 = require("../../../../web/js/mui/MUIFontAwesome");
exports.MoreActionsDropdown = React.memo(() => {
    const isElectron = AppRuntime_1.AppRuntime.isElectron();
    function onChat() {
        Nav_1.Nav.openLinkWithNewTab('https://discord.gg/GT8MhA6');
    }
    function onDocumentation() {
        Nav_1.Nav.openLinkWithNewTab('https://getpolarized.io/docs/');
    }
    function onStartAnkiSync() {
        AnkiSyncClient_1.AnkiSyncClient.start();
    }
    return (React.createElement(MUIMenu_1.MUIMenu, { caret: true, placement: "bottom-end", button: {
            icon: React.createElement(MoreVert_1.default, null),
            size: 'large'
        } },
        React.createElement("div", null,
            React.createElement(MUIMenuItem_1.MUIMenuItem, { icon: React.createElement(MUIFontAwesome_1.FADiscordIcon, null), text: "Chat with Polar Community", onClick: onChat }),
            React.createElement(MUIMenuItem_1.MUIMenuItem, { icon: React.createElement(LibraryBooks_1.default, null), text: "Documentation", onClick: onDocumentation }),
            isElectron && (React.createElement(React.Fragment, null,
                React.createElement(Divider_1.default, null),
                React.createElement(MUIMenuItem_1.MUIMenuItem, { icon: React.createElement(Sync_1.default, null), text: "Start Anki Sync", onClick: onStartAnkiSync }))))));
});
//# sourceMappingURL=MoreActionsDropdown.js.map