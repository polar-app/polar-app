"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MountProgressLoader = void 0;
const react_1 = __importDefault(require("react"));
class MountProgressLoader extends react_1.default.Component {
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return false;
    }
    componentDidMount() {
        console.log("FIXME mounted");
    }
    render() {
        return this.props.children;
    }
}
exports.MountProgressLoader = MountProgressLoader;
//# sourceMappingURL=MountProgressLoader.js.map