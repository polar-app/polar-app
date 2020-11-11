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
exports.SettingsScreen = exports.PREF_PDF_DARK_MODE_OPTIONS = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const DefaultPageLayout_1 = require("../../page_layout/DefaultPageLayout");
const KnownPrefs_1 = require("../../../../../web/js/util/prefs/KnownPrefs");
const ConfigureNavbar_1 = require("../ConfigureNavbar");
const ConfigureBody_1 = require("../ConfigureBody");
const MUIThemeTypeContext_1 = require("../../../../../web/js/mui/context/MUIThemeTypeContext");
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const SettingToggle_1 = require("./SettingToggle");
const ViewDeviceInfoButton_1 = require("./ViewDeviceInfoButton");
const SettingSelect_1 = require("./SettingSelect");
const PrefsHook_1 = require("../../persistence_layer/PrefsHook");
const CancelSubscriptionButton_1 = require("../../premium/CancelSubscriptionButton");
const MUIButtonBar_1 = require("../../../../../web/js/mui/MUIButtonBar");
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const ManageSubscriptionButton_1 = require("../../premium/ManageSubscriptionButton");
exports.PREF_PDF_DARK_MODE_OPTIONS = [
    {
        id: 'invert',
        label: 'Invert PDF colors to dark'
    },
    {
        id: 'invert-greyscale',
        label: 'Invert PDF colors to dark (greyscale)'
    },
    {
        id: 'natural',
        label: 'Use the natural colors of the PDF'
    }
];
exports.SettingsScreen = () => {
    const { theme, setTheme } = react_1.useContext(MUIThemeTypeContext_1.MUIThemeTypeContext);
    const handleDarkModeToggle = (enabled) => {
        const theme = enabled ? 'dark' : 'light';
        setTimeout(() => setTheme(theme), 1);
    };
    const prefs = PrefsHook_1.usePrefs().value;
    return (React.createElement(DefaultPageLayout_1.DefaultPageLayout, null,
        React.createElement(ConfigureBody_1.ConfigureBody, null,
            React.createElement(ConfigureNavbar_1.ConfigureNavbar, null),
            React.createElement("div", { className: "" },
                React.createElement("h1", null, "General"),
                React.createElement("h2", null, "General settings. Note that some of these may require you to reload."),
                React.createElement(SettingToggle_1.SettingToggle, { title: "Dark Mode", description: "Enable dark mode which is easier on the eyes in low light environments and just looks better.", name: "dark-mode", defaultValue: theme === 'dark', prefs: prefs, onChange: handleDarkModeToggle }),
                React.createElement(SettingSelect_1.SettingSelect, { title: "PDF Dark Mode Handling", description: "Enable custom dark mode handling for PDFs.  This allows to change how the PDF colors are displayed.", name: "dark-mode-pdf", options: [
                        {
                            id: 'invert',
                            label: 'Invert PDF colors to dark'
                        },
                        {
                            id: 'invert-greyscale',
                            label: 'Invert PDF colors to dark (greyscale)'
                        },
                        {
                            id: 'natural',
                            label: 'Use the natural colors of the PDF'
                        }
                    ] }),
                React.createElement(SettingToggle_1.SettingToggle, { title: "Automatically resume reading position", description: "This feature restores the document reading position using pagemarks when reopening a document.", name: "settings-auto-resume", defaultValue: true, prefs: prefs }),
                React.createElement(SettingToggle_1.SettingToggle, { title: "Automatic pagemarks", description: "Enables auto pagemark creation as you scroll and read a document.  ONLY usable for the PDF documents.", name: KnownPrefs_1.KnownPrefs.AUTO_PAGEMARKS, prefs: prefs, preview: true }),
                React.createElement(SettingToggle_1.SettingToggle, { title: "Development", description: "Enables general development features for software engineers working on Polar.", name: "dev", prefs: prefs, preview: true }),
                React.createElement(Divider_1.default, null),
                React.createElement(Box_1.default, { mt: 1 },
                    React.createElement(MUIButtonBar_1.MUIButtonBar, null,
                        React.createElement(ViewDeviceInfoButton_1.ViewDeviceInfoButton, null),
                        React.createElement(CancelSubscriptionButton_1.CancelSubscriptionButton, null),
                        React.createElement(ManageSubscriptionButton_1.ManageSubscriptionButton, null)))))));
};
//# sourceMappingURL=SettingsScreen.js.map