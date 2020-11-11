"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUITagRow = void 0;
const react_1 = __importDefault(require("react"));
const TableRow_1 = __importDefault(require("@material-ui/core/TableRow"));
const TableCell_1 = __importDefault(require("@material-ui/core/TableCell"));
const MUIEfficientCheckbox_1 = require("./MUIEfficientCheckbox");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
exports.MUITagRow = react_1.default.memo((props) => {
    return (react_1.default.createElement(TableRow_1.default, { hover: true, role: "checkbox", tabIndex: -1 },
        react_1.default.createElement(TableCell_1.default, null,
            react_1.default.createElement(MUIEfficientCheckbox_1.MUIEfficientCheckbox, { checked: true })),
        react_1.default.createElement(TableCell_1.default, null, props.label),
        react_1.default.createElement(TableCell_1.default, null, props.info)));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUITagRow.js.map