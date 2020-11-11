"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportButton = void 0;
const react_1 = __importDefault(require("react"));
const MUIMenu_1 = require("../../mui/menu/MUIMenu");
const GetApp_1 = __importDefault(require("@material-ui/icons/GetApp"));
const MUIMenuItem_1 = require("../../mui/menu/MUIMenuItem");
exports.ExportButton = (props) => {
    return (react_1.default.createElement(MUIMenu_1.MUIMenu, { button: {
            icon: react_1.default.createElement(GetApp_1.default, null)
        } },
        react_1.default.createElement("div", null,
            react_1.default.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Download as markdown", onClick: () => props.onExport('markdown') }),
            react_1.default.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Download as JSON", onClick: () => props.onExport('json') }))));
};
//# sourceMappingURL=ExportButton.js.map