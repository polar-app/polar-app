"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIRelatedOptionsChips = void 0;
const Grid_1 = __importDefault(require("@material-ui/core/Grid"));
const Chip_1 = __importDefault(require("@material-ui/core/Chip"));
const React = __importStar(require("react"));
function MUIRelatedOptionsChips(props) {
    return (React.createElement(Grid_1.default, { container: true, direction: "row", justify: "flex-start", alignItems: "center", spacing: 1 }, props.relatedOptions.map(option => React.createElement(Grid_1.default, { item: true, key: option.id },
        React.createElement(Chip_1.default, { label: option.label, size: "small", onClick: () => props.onAddRelatedOption(option) })))));
}
exports.MUIRelatedOptionsChips = MUIRelatedOptionsChips;
;
//# sourceMappingURL=MUIRelatedOptionsChips.js.map