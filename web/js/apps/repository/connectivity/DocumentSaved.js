"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSaved = void 0;
const react_1 = __importDefault(require("react"));
const CloudDone_1 = __importDefault(require("@material-ui/icons/CloudDone"));
const Icon_1 = __importDefault(require("@material-ui/core/Icon"));
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const MUITooltip_1 = require("../../../mui/MUITooltip");
exports.DocumentSaved = react_1.default.memo(() => {
    const theme = useTheme_1.default();
    return (react_1.default.createElement(MUITooltip_1.MUITooltip, { title: "Document fully written to the the cloud.." },
        react_1.default.createElement(Icon_1.default, { style: { color: theme.palette.text.secondary } },
            react_1.default.createElement(CloudDone_1.default, null))));
});
//# sourceMappingURL=DocumentSaved.js.map