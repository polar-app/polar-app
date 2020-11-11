"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIGridLayout = void 0;
const react_1 = __importDefault(require("react"));
const Grid_1 = __importDefault(require("@material-ui/core/Grid"));
exports.MUIGridLayout = (props) => {
    const gridProps = {
        id: props.id,
        className: props.className,
        style: props.style,
        direction: props.direction || 'row',
        justify: props.justify || 'flex-start',
        alignItems: props.alignItems || 'center',
        spacing: props.spacing || 1,
        wrap: props.wrap || 'nowrap'
    };
    return (react_1.default.createElement(Grid_1.default, Object.assign({ container: true }, gridProps), props.items.map(item => (react_1.default.createElement(Grid_1.default, { item: true, key: item.key || undefined }, item)))));
};
//# sourceMappingURL=MUIGridLayout.js.map