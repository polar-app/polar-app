"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDocFlagButton = void 0;
const react_1 = __importDefault(require("react"));
const Flag_1 = __importDefault(require("@material-ui/icons/Flag"));
const StandardToggleButton_1 = require("./StandardToggleButton");
exports.MUIDocFlagButton = react_1.default.memo((props) => (react_1.default.createElement(StandardToggleButton_1.StandardToggleButton, Object.assign({ tooltip: "Flag" }, props),
    react_1.default.createElement(Flag_1.default, null))));
//# sourceMappingURL=MUIDocFlagButton.js.map