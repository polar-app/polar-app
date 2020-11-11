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
exports.UpgradeRequired = void 0;
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Analytics_1 = require("../../analytics/Analytics");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
class UpgradeRequired extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        Analytics_1.Analytics.event({ category: 'upgrade', action: 'triggered-upgrade-required' });
        const onClick = () => {
            Analytics_1.Analytics.event({ category: 'upgrade', action: 'clicked-button-to-plans' });
        };
        return React.createElement("div", { className: "mt-1 mb-1 p-1 rounded", style: {
                backgroundColor: '#ffcccc',
                fontWeight: 'bold',
                display: 'flex'
            } },
            React.createElement(react_router_dom_1.Link, { to: { pathname: '/plans' } },
                React.createElement(Button_1.default, { color: "primary", variant: "contained", style: { fontWeight: 'bold' }, onClick: () => onClick() },
                    React.createElement("i", { className: "fas fa-certificate" }),
                    "\u00A0 Upgrade Now")),
            React.createElement("div", { className: "ml-1 mt-auto mb-auto" }, "Your account has exceeded limits for your current plan.  Sync will be disabled in 1 week."));
    }
}
exports.UpgradeRequired = UpgradeRequired;
//# sourceMappingURL=UpgradeRequired.js.map