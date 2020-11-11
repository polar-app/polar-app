"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullCollapse = void 0;
const react_1 = __importDefault(require("react"));
class NullCollapse extends react_1.default.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.open) {
            return this.props.children;
        }
        else {
            return null;
        }
    }
}
exports.NullCollapse = NullCollapse;
//# sourceMappingURL=NullCollapse.js.map