"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPUBIFrameMenu = void 0;
const ReactUtils_1 = require("../../../../../../web/js/react/ReactUtils");
const MUIMenuItem_1 = require("../../../../../../web/js/mui/menu/MUIMenuItem");
const react_1 = __importDefault(require("react"));
exports.EPUBIFrameMenu = ReactUtils_1.deepMemo((props) => {
    function handleCreatePagemark() {
        console.log(props.origin.target);
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Create Pagemark", onClick: handleCreatePagemark })));
});
//# sourceMappingURL=EPUBIFrameMenu.js.map