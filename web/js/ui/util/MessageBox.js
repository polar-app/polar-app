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
exports.MessageBox = void 0;
const React = __importStar(require("react"));
class MessageBox extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }
    render() {
        const width = this.props.width || 600;
        const position = this.props.position || 'bottom';
        const style = {
            position: 'fixed',
            zIndex: 999999999999999,
            width: '100%'
        };
        switch (position) {
            case "bottom":
                style.bottom = '25px';
                break;
            case "top":
                style.top = '25px';
                break;
        }
        return React.createElement("div", { style: style },
            React.createElement("div", { style: {
                    width: width + 'px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    backgroundColor: 'var(--primary-background-color)'
                }, className: "border rounded shadow p-3" }, this.props.children));
    }
}
exports.MessageBox = MessageBox;
//# sourceMappingURL=MessageBox.js.map