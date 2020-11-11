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
exports.FeatureIntro = void 0;
const React = __importStar(require("react"));
const NullCollapse_1 = require("../null_collapse/NullCollapse");
const SplitLayout_1 = require("../split_layout/SplitLayout");
class FeatureIntro extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onDone = this.onDone.bind(this);
        this.state = {
            active: this.isActive()
        };
    }
    render() {
        return React.createElement(NullCollapse_1.NullCollapse, { open: this.state.active },
            React.createElement("div", { className: "border rounded text-muted mt-1 mb-1", style: { fontSize: 'smaller' } },
                React.createElement(SplitLayout_1.SplitLayout, null,
                    React.createElement(SplitLayout_1.SplitLayoutLeft, null,
                        React.createElement("div", { className: "p-1" },
                            React.createElement("span", { className: "text-muted text-xs", onClick: () => this.onDone(), style: { float: 'right', fontSize: '15px', cursor: 'pointer' } },
                                React.createElement("i", { className: "fas fa-times-circle" })),
                            this.props.children)))));
    }
    onDone() {
        this.setState({ active: false });
        this.mark();
    }
    isActive() {
        return localStorage.getItem(this.props.itemName) !== 'inactive';
    }
    mark() {
        localStorage.setItem(this.props.itemName, 'inactive');
    }
}
exports.FeatureIntro = FeatureIntro;
//# sourceMappingURL=FeatureIntro.js.map