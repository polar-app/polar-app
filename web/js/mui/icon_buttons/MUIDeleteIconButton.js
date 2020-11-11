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
exports.MUIDeleteIconButton = void 0;
const React = __importStar(require("react"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Delete_1 = __importDefault(require("@material-ui/icons/Delete"));
const MUIDeleteAction_1 = require("../actions/MUIDeleteAction");
const MUIDialogControllers_1 = require("../dialogs/MUIDialogControllers");
exports.MUIDeleteIconButton = (props) => {
    const handleClick = MUIDeleteAction_1.MUIDeleteAction.create(props);
    const dialogs = MUIDialogControllers_1.useDialogManager();
    return (React.createElement(IconButton_1.default, { onClick: () => handleClick(dialogs) },
        React.createElement(Delete_1.default, null)));
};
//# sourceMappingURL=MUIDeleteIconButton.js.map