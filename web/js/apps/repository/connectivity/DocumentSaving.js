"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSaving = void 0;
const react_1 = __importDefault(require("react"));
const CloudUpload_1 = __importDefault(require("@material-ui/icons/CloudUpload"));
const Icon_1 = __importDefault(require("@material-ui/core/Icon"));
const useTheme_1 = __importDefault(require("@material-ui/core/styles/useTheme"));
const MUITooltip_1 = require("../../../mui/MUITooltip");
exports.DocumentSaving = react_1.default.memo(() => {
    const theme = useTheme_1.default();
    return (react_1.default.createElement(MUITooltip_1.MUITooltip, { title: "Document being saved to the cloud and will be written upon reconnect." },
        react_1.default.createElement(Icon_1.default, { style: { color: theme.palette.text.secondary } },
            react_1.default.createElement(CloudUpload_1.default, null))));
});
//# sourceMappingURL=DocumentSaving.js.map