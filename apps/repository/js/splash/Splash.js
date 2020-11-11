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
exports.Splash = void 0;
const React = __importStar(require("react"));
const ConditionalSetting_1 = require("../../../../web/js/ui/util/ConditionalSetting");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Input_1 = __importDefault(require("@material-ui/core/Input"));
const InputLabel_1 = __importDefault(require("@material-ui/core/InputLabel"));
const Styles = {
    label: {
        cursor: 'pointer',
        userSelect: 'none'
    }
};
class Splash extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.doNotShowAgain = false;
        this.state = {
            open: true
        };
        this.onClose = this.onClose.bind(this);
        this.onLater = this.onLater.bind(this);
        this.onDoNotShowAgain = this.onDoNotShowAgain.bind(this);
    }
    render() {
        const CloseButton = () => {
            if (this.props.disableClose) {
                return (React.createElement("div", null));
            }
            else {
                return (React.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: () => this.onClose() }, "Close"));
            }
        };
        const DontShowAgain = () => {
            if (this.props.disableDontShowAgain) {
                return (React.createElement("div", null));
            }
            else {
                return (React.createElement(React.Fragment, null,
                    React.createElement(InputLabel_1.default, { style: Styles.label },
                        React.createElement(Input_1.default, { type: "checkbox", onChange: (event) => this.onDoNotShowAgain(!this.doNotShowAgain) }),
                        "Don't show again")));
            }
        };
        return null;
    }
    onDoNotShowAgain(value) {
        this.doNotShowAgain = value;
    }
    onLater() {
        const conditionalSetting = new ConditionalSetting_1.ConditionalSetting(this.props.settingKey);
        const after = Date.now() + (24 * 60 * 60 * 1000);
        conditionalSetting.set(`${after}`);
        this.setState({ open: false });
        document.location.href = '#';
    }
    onClose() {
        if (this.doNotShowAgain) {
            const conditionalSetting = new ConditionalSetting_1.ConditionalSetting(this.props.settingKey);
            conditionalSetting.set('do-not-show-again');
        }
        this.setState({ open: false });
    }
}
exports.Splash = Splash;
//# sourceMappingURL=Splash.js.map