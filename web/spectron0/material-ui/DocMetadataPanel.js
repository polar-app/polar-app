"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocMetaPanel = void 0;
const react_1 = __importDefault(require("react"));
const Paper_1 = __importDefault(require("@material-ui/core/Paper"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
exports.DocMetaPanel = () => {
    return (react_1.default.createElement(Paper_1.default, { square: true, elevation: 0 },
        react_1.default.createElement(Typography_1.default, null)));
};
//# sourceMappingURL=DocMetadataPanel.js.map