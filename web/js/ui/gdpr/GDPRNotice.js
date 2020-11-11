"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GDPRNotice = void 0;
const react_1 = __importDefault(require("react"));
const Devices_1 = require("polar-shared/src/util/Devices");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
class Styles {
}
Styles.notice = {
    position: 'fixed',
    width: '450px',
    bottom: '10px',
    right: '15px',
    zIndex: 999999,
    backgroundColor: '#ced4da',
    whiteSpace: 'initial'
};
Styles.intro = {
    fontWeight: 'bold',
    fontSize: '22px',
    margin: '5px 0px 10px 0px'
};
class GDPRNotice extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onAccept = this.onAccept.bind(this);
        this.state = {
            disabled: window.localStorage.getItem('gdpr-accepted') === 'true'
        };
    }
    render() {
        const display = this.state.disabled ? 'none' : 'block';
        if (!Devices_1.Devices.isDesktop()) {
            return null;
        }
        return (react_1.default.createElement("div", { id: "gdpr-notice", style: { display } },
            react_1.default.createElement("div", { className: "p-3 m-2 rounded", style: Styles.notice },
                react_1.default.createElement("div", { className: "pt-1 pb-1" },
                    react_1.default.createElement("div", { style: Styles.intro }, "We use cookies to track improve Polar."),
                    react_1.default.createElement("p", null, "We use cookies to help improve the quality of Polar."),
                    react_1.default.createElement("p", null,
                        "We ",
                        react_1.default.createElement("b", null, "do not"),
                        " send personally identifiable information at any point."),
                    react_1.default.createElement("p", null,
                        "We ",
                        react_1.default.createElement("b", null, "do not"),
                        " sell your private data to 3rd parties.")),
                react_1.default.createElement("div", { className: "text-right" },
                    react_1.default.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: () => this.onAccept() }, "Accept")))));
    }
    onAccept() {
        window.localStorage.setItem('gdpr-accepted', 'true');
        this.setState({
            disabled: true
        });
    }
}
exports.GDPRNotice = GDPRNotice;
//# sourceMappingURL=GDPRNotice.js.map