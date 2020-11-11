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
exports.LeftRightSplit = void 0;
const React = __importStar(require("react"));
class LeftRightSplit extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        let margins = {
            bottom: 'auto',
            top: undefined
        };
        const rightOpts = this.props.rightOpts || {};
        const verticalAlign = rightOpts.verticalAlign || 'top';
        if (verticalAlign === 'middle') {
            margins = {
                bottom: 'auto',
                top: 'auto'
            };
        }
        return (React.createElement("div", { className: 'split-layout' + " " + this.props.className || "", style: this.props.style },
            React.createElement("div", { style: { display: 'flex' } },
                React.createElement("div", { className: "split-left", style: {
                        verticalAlign: 'top'
                    } }, this.props.left),
                React.createElement("div", { className: "split-right", style: {
                        marginBottom: margins.bottom,
                        marginTop: margins.top,
                        marginLeft: 'auto',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        verticalAlign
                    } }, this.props.right))));
    }
}
exports.LeftRightSplit = LeftRightSplit;
//# sourceMappingURL=LeftRightSplit.js.map