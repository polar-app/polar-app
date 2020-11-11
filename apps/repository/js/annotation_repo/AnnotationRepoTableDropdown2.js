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
exports.AnnotationRepoTableDropdown2 = void 0;
const React = __importStar(require("react"));
const Devices_1 = require("polar-shared/src/util/Devices");
const MUIMenu_1 = require("../../../../web/js/mui/menu/MUIMenu");
const MUIMenuItem_1 = require("../../../../web/js/mui/menu/MUIMenuItem");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const GetApp_1 = __importDefault(require("@material-ui/icons/GetApp"));
exports.AnnotationRepoTableDropdown2 = ReactUtils_1.deepMemo((props) => {
    if (!Devices_1.Devices.isDesktop()) {
        return null;
    }
    return (React.createElement("div", null,
        React.createElement(MUIMenu_1.MUIMenu, { caret: true, placement: "bottom-end", button: {
                icon: React.createElement(GetApp_1.default, null),
                size: 'small'
            } },
            React.createElement("div", null,
                React.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Download as Markdown", onClick: () => props.onExport('markdown') }),
                React.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Download as JSON", onClick: () => props.onExport('json') })))));
});
//# sourceMappingURL=AnnotationRepoTableDropdown2.js.map