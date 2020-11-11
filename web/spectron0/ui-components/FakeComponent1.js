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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeComponent1 = void 0;
const React = __importStar(require("react"));
class FakeComponent1 extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.updateTitle = this.updateTitle.bind(this);
        this.state = {
            title: 'FakeComponent1'
        };
    }
    render() {
        console.log("FakeComponent1: render");
        return React.createElement("div", null,
            this.state.title,
            ":");
    }
    updateTitle() {
        this.setState({ title: "FakeComponent1: " + new Date().toISOString() });
    }
}
exports.FakeComponent1 = FakeComponent1;
//# sourceMappingURL=FakeComponent1.js.map