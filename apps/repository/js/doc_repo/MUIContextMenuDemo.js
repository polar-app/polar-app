"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIContextMenuDemo = void 0;
const react_1 = __importDefault(require("react"));
const MUIContextMenu_1 = require("./MUIContextMenu");
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem"));
const ChildComponent = () => {
    const contextMenu = useMyContextMenu();
    return (react_1.default.createElement("div", Object.assign({}, contextMenu), "this is my child component"));
};
const MyMenu = () => (react_1.default.createElement(react_1.default.Fragment, null,
    react_1.default.createElement(MenuItem_1.default, null, "Profile"),
    react_1.default.createElement(MenuItem_1.default, null, "home")));
const [MyContextMenu, useMyContextMenu] = MUIContextMenu_1.createContextMenu(MyMenu);
exports.MUIContextMenuDemo = () => {
    return (react_1.default.createElement(MyContextMenu, null,
        react_1.default.createElement(ChildComponent, null)));
};
//# sourceMappingURL=MUIContextMenuDemo.js.map