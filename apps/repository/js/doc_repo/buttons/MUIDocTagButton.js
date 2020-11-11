"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDocTagButton = void 0;
const react_1 = __importDefault(require("react"));
const LocalOffer_1 = __importDefault(require("@material-ui/icons/LocalOffer"));
const StandardIconButton_1 = require("./StandardIconButton");
exports.MUIDocTagButton = react_1.default.memo((props) => (react_1.default.createElement(StandardIconButton_1.StandardIconButton, Object.assign({ tooltip: "Tag" }, props),
    react_1.default.createElement(LocalOffer_1.default, null))));
//# sourceMappingURL=MUIDocTagButton.js.map