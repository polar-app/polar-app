"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalAlign = void 0;
const react_1 = __importDefault(require("react"));
class VerticalAlign extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (react_1.default.createElement("div", { className: "mt-auto mb-auto" }, this.props.children));
    }
}
exports.VerticalAlign = VerticalAlign;
//# sourceMappingURL=VerticalAlign.js.map