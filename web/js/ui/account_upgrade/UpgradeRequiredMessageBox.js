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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpgradeRequiredMessageBox = void 0;
const React = __importStar(require("react"));
const MessageBox_1 = require("../util/MessageBox");
const BlackoutBox_1 = require("../util/BlackoutBox");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
class UpgradeRequiredMessageBox extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onUpgrade = this.onUpgrade.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }
    onCancel() {
        this.props.dispose();
    }
    onUpgrade() {
        this.props.dispose();
        document.location.href = '/plans';
    }
    render() {
        return (React.createElement(BlackoutBox_1.BlackoutBox, null,
            React.createElement(MessageBox_1.MessageBox, { position: 'top' },
                React.createElement("div", { className: "text-center text-grey400 mb-2", style: { fontSize: '95px' } },
                    React.createElement("i", { className: "fas fa-smile" })),
                React.createElement("div", { className: "text-grey700 text-bold mb-3 text-center", style: { fontSize: '25px', fontWeight: 'bold' } }, "It's time to upgrade!"),
                React.createElement("div", { style: { maxWidth: '400px' }, className: "ml-auto mr-auto text-center" },
                    React.createElement("p", { className: "" }, "You've reach the limits of your plan."),
                    React.createElement("p", { className: "" }, "You'll need to upgrade to premium to add this document."),
                    React.createElement("i", { className: "fas fa-check text-success" }),
                    " More storage for larger repositories. ",
                    React.createElement("br", null),
                    React.createElement("i", { className: "fas fa-check text-success" }),
                    " Supports more devices for cross-device sync.",
                    React.createElement("br", null),
                    React.createElement("i", { className: "fas fa-check text-success" }),
                    " Helps fund future development of Polar.",
                    React.createElement("br", null)),
                React.createElement("div", { className: "text-center mt-4" },
                    React.createElement(Button_1.default, { color: "secondary", variant: "contained", onClick: () => this.onCancel(), className: "" }, "Maybe Later"),
                    React.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: () => this.onUpgrade(), className: "ml-1" }, "Upgrade")))));
    }
}
exports.UpgradeRequiredMessageBox = UpgradeRequiredMessageBox;
//# sourceMappingURL=UpgradeRequiredMessageBox.js.map