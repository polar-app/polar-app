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
exports.AccountUpgradeBarView = void 0;
const React = __importStar(require("react"));
const UpgradeRequired_1 = require("./UpgradeRequired");
const Arrays_1 = require("polar-shared/src/util/Arrays");
const react_router_dom_1 = require("react-router-dom");
const Analytics_1 = require("../../analytics/Analytics");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const ReactUtils_1 = require("../../react/ReactUtils");
const AccountUpgrader_1 = require("./AccountUpgrader");
const MESSAGE = createRandomizedUpgradeMessage();
const GoPremium = (props) => {
    Analytics_1.Analytics.event({ category: 'upgrade', action: 'triggered-upgrade-required' });
    const onClick = () => {
        Analytics_1.Analytics.event({ category: 'upgrade', action: 'clicked-button-to-plans' });
    };
    return React.createElement("div", { className: "mt-1 mb-1 p-1 rounded", style: {
            backgroundColor: '#ffcccc',
            fontWeight: 'bold'
        } },
        React.createElement(react_router_dom_1.Link, { to: { pathname: '/plans' } },
            React.createElement(Button_1.default, { color: "primary", variant: "contained", style: { fontWeight: 'bold' }, onClick: () => onClick() },
                React.createElement("i", { className: "fas fa-certificate" }),
                "\u00A0 Go Premium!")),
        React.createElement("span", { className: "ml-1" }, MESSAGE));
};
const NullComponent = () => {
    return React.createElement("div", null);
};
exports.AccountUpgradeBarView = ReactUtils_1.deepMemo((props) => {
    const { plan } = props;
    const accountUpgrade = AccountUpgrader_1.useAccountUpgrader();
    if (accountUpgrade === null || accountUpgrade === void 0 ? void 0 : accountUpgrade.required) {
        return React.createElement(UpgradeRequired_1.UpgradeRequired, { planRequired: accountUpgrade.toPlan });
    }
    if (!plan || plan === 'free') {
        return React.createElement(GoPremium, null);
    }
    else {
        return React.createElement(NullComponent, null);
    }
});
function createRandomizedUpgradeMessage() {
    const messages = [
        "Want a dark mode? How about ePub support? Go premium and support Polar development!",
        "Premium users help support future Polar development and are generally pretty awesome.",
        "Guess who else used Polar Premium? Einstein! You want to be like Einstein don't you?",
        "It's scientifically proven that Polar premium adds 100 years to your life!",
        "Polar Premium users help keep Polar ad-free and no annoying banners (like this one).",
        "Keep Polar ad-free!  Upgrading to premium helps support Polar and unlocks additional storage."
    ];
    const randomized = Arrays_1.Arrays.shuffle(...messages);
    return Arrays_1.Arrays.first(randomized);
}
//# sourceMappingURL=AccountUpgradeBarView.js.map