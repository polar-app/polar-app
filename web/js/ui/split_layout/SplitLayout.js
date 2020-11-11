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
exports.SplitLayoutLeft = exports.SplitLayout = void 0;
const React = __importStar(require("react"));
class SplitLayout extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement("div", { className: "split-layout pl-0 pr-0" },
            React.createElement("div", { style: { display: 'flex' } }, this.props.children)));
    }
}
exports.SplitLayout = SplitLayout;
class SplitLayoutLeft extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement("div", { className: "split-layout-left", style: {
                verticalAlign: 'top'
            } }, this.props.children));
    }
}
exports.SplitLayoutLeft = SplitLayoutLeft;
//# sourceMappingURL=SplitLayout.js.map