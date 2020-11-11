"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIGridLayoutTest = void 0;
const react_1 = __importDefault(require("react"));
const MUIGridLayout_1 = require("../../../js/mui/MUIGridLayout");
const items = [
    react_1.default.createElement("div", { key: 0 }, "first"),
    react_1.default.createElement("div", { key: 1 }, "second")
];
exports.MUIGridLayoutTest = () => {
    return (react_1.default.createElement(MUIGridLayout_1.MUIGridLayout, { items: items }));
};
//# sourceMappingURL=MUIGridLayoutTest.js.map