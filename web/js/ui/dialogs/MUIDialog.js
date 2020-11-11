"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDialog = void 0;
const ReactUtils_1 = require("../../react/ReactUtils");
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const react_1 = __importDefault(require("react"));
exports.MUIDialog = ReactUtils_1.deepMemo((props) => {
    return (react_1.default.createElement(Dialog_1.default, Object.assign({}, props, { transitionDuration: 50 }), props.children));
});
//# sourceMappingURL=MUIDialog.js.map