"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinearProgressWithLabel = void 0;
const react_1 = __importDefault(require("react"));
const LinearProgress_1 = __importDefault(require("@material-ui/core/LinearProgress"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const ReactUtils_1 = require("../../react/ReactUtils");
exports.LinearProgressWithLabel = ReactUtils_1.deepMemo((props) => {
    const rounded = Math.round(props.value);
    return (react_1.default.createElement(Box_1.default, { display: "flex", alignItems: "center" },
        react_1.default.createElement(Box_1.default, { width: "100%", mr: 1 },
            react_1.default.createElement(LinearProgress_1.default, Object.assign({ variant: "determinate" }, props))),
        react_1.default.createElement(Box_1.default, { minWidth: 35 },
            react_1.default.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", style: { fontSize: '13px' } }, `${rounded}%`))));
});
//# sourceMappingURL=LinearProgressWithLabel.js.map