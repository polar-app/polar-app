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
exports.TwoMigrationContent = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const PolarSVGIcon_1 = require("../../../../../web/js/ui/svg_icons/PolarSVGIcon");
const Brightness4_1 = __importDefault(require("@material-ui/icons/Brightness4"));
const MUIBrowserLinks_1 = require("../../../../../web/js/mui/MUIBrowserLinks");
const CloudDone_1 = __importDefault(require("@material-ui/icons/CloudDone"));
const Description_1 = __importDefault(require("@material-ui/icons/Description"));
const Sync_1 = __importDefault(require("@material-ui/icons/Sync"));
const Keyboard_1 = __importDefault(require("@material-ui/icons/Keyboard"));
const Feature = (props) => {
    return (React.createElement("div", { style: {
            display: 'flex',
            alignItems: 'top',
            marginBottom: '1em'
        } },
        React.createElement("div", null, props.icon),
        React.createElement("div", { style: { paddingLeft: '1em', flexGrow: 1 } },
            React.createElement("div", { style: { fontWeight: 'bold', fontSize: '1.2em' } }, props.title),
            React.createElement("div", { style: { display: 'flex' } },
                React.createElement("div", { style: { flexGrow: 1 } }, props.description),
                React.createElement("div", { style: { paddingLeft: '5px', whiteSpace: 'nowrap' } },
                    React.createElement("a", { href: props.link }, "Read more"))))));
};
exports.TwoMigrationContent = ReactUtils_1.deepMemo(() => {
    return (React.createElement(MUIBrowserLinks_1.MUIBrowserLinks, null,
        React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
            React.createElement(PolarSVGIcon_1.PolarSVGIcon, { width: 150, height: 150 })),
        React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
            React.createElement("h1", null, "Welcome to Polar 2.0!")),
        React.createElement("p", null, "What's new in this release?"),
        React.createElement(Feature, { title: "Dark Mode", description: "You can now pick between light and dark mode.", link: "none", icon: React.createElement(Brightness4_1.default, null) }),
        React.createElement(Feature, { title: "Cloud Only", description: "We're now cloud-only.  Migration from 1.0 is simple and should just take a few minutes.", link: "none", icon: React.createElement(CloudDone_1.default, null) }),
        React.createElement(Feature, { title: "EPUB Now Supported", description: "EPUB is now a supported document format.", link: "none", icon: React.createElement(Description_1.default, null) }),
        React.createElement(Feature, { title: "Improved Anki Sync", description: "We've improved our Anki sync support and stability.", link: "none", icon: React.createElement(Sync_1.default, null) }),
        React.createElement(Feature, { title: "Keyboard Shortcuts", description: "We've dramatically improved our support for keyboad shortcuts.", link: "none", icon: React.createElement(Keyboard_1.default, null) })));
});
//# sourceMappingURL=TwoMigrationContent.js.map