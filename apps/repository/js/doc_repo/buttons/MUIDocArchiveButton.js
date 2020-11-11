"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDocArchiveButton = void 0;
const react_1 = __importDefault(require("react"));
const Archive_1 = __importDefault(require("@material-ui/icons/Archive"));
const StandardToggleButton_1 = require("./StandardToggleButton");
exports.MUIDocArchiveButton = react_1.default.memo((props) => (react_1.default.createElement(StandardToggleButton_1.StandardToggleButton, Object.assign({ tooltip: "Archive" }, props),
    react_1.default.createElement(Archive_1.default, null))));
//# sourceMappingURL=MUIDocArchiveButton.js.map