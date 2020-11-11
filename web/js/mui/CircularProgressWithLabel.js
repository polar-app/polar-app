"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircularProgressWithLabel = void 0;
const react_1 = __importDefault(require("react"));
const CircularProgress_1 = __importDefault(require("@material-ui/core/CircularProgress"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const ReactUtils_1 = require("../react/ReactUtils");
exports.CircularProgressWithLabel = ReactUtils_1.deepMemo((props) => {
    return (react_1.default.createElement(Box_1.default, { position: "relative", display: "inline-flex" },
        react_1.default.createElement(CircularProgress_1.default, Object.assign({ variant: "static" }, props)),
        react_1.default.createElement(Box_1.default, { top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" },
            react_1.default.createElement(Typography_1.default, { variant: "caption", component: "div", color: "textSecondary" }, `${Math.round(props.value)}%`))));
});
//# sourceMappingURL=CircularProgressWithLabel.js.map