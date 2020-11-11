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
exports.FakeComponent0 = void 0;
const React = __importStar(require("react"));
const FakeComponent1_1 = require("./FakeComponent1");
class FakeComponent0 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.updateTitle = this.updateTitle.bind(this);
        this.state = {
            title: "FakeComponent0"
        };
    }
    render() {
        console.log("FakeComponent0: render");
        return React.createElement("div", null,
            this.state.title,
            ":",
            React.createElement(FakeComponent1_1.FakeComponent1, null));
    }
    updateTitle() {
        this.setState({ title: "FakeComponent0: " + ": " + new Date().toISOString() });
    }
}
exports.FakeComponent0 = FakeComponent0;
//# sourceMappingURL=FakeComponent0.js.map