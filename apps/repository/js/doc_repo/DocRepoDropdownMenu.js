"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoDropdownMenu = void 0;
const react_1 = __importDefault(require("react"));
const Menu_1 = __importDefault(require("@material-ui/core/Menu"));
const MUIDocDropdownMenuItems_1 = require("./MUIDocDropdownMenuItems");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.DocRepoDropdownMenu = ReactUtils_1.deepMemo((props) => {
    const { anchorEl } = props;
    return (react_1.default.createElement(Menu_1.default, { id: "doc-dropdown-menu", anchorEl: anchorEl, keepMounted: true, getContentAnchorEl: null, anchorOrigin: { vertical: "bottom", horizontal: "center" }, transformOrigin: { vertical: "top", horizontal: "center" }, open: Boolean(anchorEl), onClose: () => props.onClose(), onClick: () => props.onClose() },
        react_1.default.createElement(MUIDocDropdownMenuItems_1.MUIDocDropdownMenuItems, null)));
});
//# sourceMappingURL=DocRepoDropdownMenu.js.map