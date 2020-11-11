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
exports.AccountOverview = void 0;
const React = __importStar(require("react"));
const PlanIcon_1 = require("./PlanIcon");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const Plans_1 = require("polar-accounts/src/Plans");
const Joiner = () => (React.createElement("div", { className: "ml-2 mr-2", style: {
        display: 'flex',
        flexDirection: 'column',
        width: '20px',
        borderWidth: '2px'
    } },
    React.createElement("div", { style: {
            borderBottom: '2px solid var(--secondary)',
            height: '25px'
        } }),
    React.createElement("div", { className: "border-secondary border-top mb-auto" })));
exports.AccountOverview = ReactUtils_1.deepMemo((props) => {
    const v2Plan = Plans_1.Plans.toV2(props.subscription.plan);
    return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
        React.createElement("div", { className: "ml-auto mr-auto", style: {
                display: 'flex'
            } },
            React.createElement(PlanIcon_1.PlanIcon, { level: 'free', active: v2Plan.level === 'free' }),
            React.createElement(Joiner, null),
            React.createElement(PlanIcon_1.PlanIcon, { level: 'plus', active: v2Plan.level === 'plus' }),
            React.createElement(Joiner, null),
            React.createElement(PlanIcon_1.PlanIcon, { level: 'pro', active: v2Plan.level === 'pro' }))));
});
//# sourceMappingURL=AccountOverview.js.map