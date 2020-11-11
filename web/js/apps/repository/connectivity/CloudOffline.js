"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudOffline = void 0;
const react_1 = __importDefault(require("react"));
const Icon_1 = __importDefault(require("@material-ui/core/Icon"));
const CloudOff_1 = __importDefault(require("@material-ui/icons/CloudOff"));
const MUITooltip_1 = require("../../../mui/MUITooltip");
exports.CloudOffline = react_1.default.memo(() => (react_1.default.createElement(MUITooltip_1.MUITooltip, { title: "You're currently offline and not connected to the cloud." },
    react_1.default.createElement(Icon_1.default, null,
        react_1.default.createElement(CloudOff_1.default, null)))));
//# sourceMappingURL=CloudOffline.js.map