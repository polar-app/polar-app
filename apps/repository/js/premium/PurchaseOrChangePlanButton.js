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
exports.PurchaseOrChangePlanButton = void 0;
const React = __importStar(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const ChangePlanAction_1 = require("./actions/ChangePlanAction");
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    current_plan: {
        color: theme.palette.secondary.light,
        fontSize: '18px',
        fontWeight: 'bold'
    },
}));
exports.PurchaseOrChangePlanButton = ReactUtils_1.deepMemo((props) => {
    const classes = useStyles();
    const changePlanActionContext = ChangePlanAction_1.useChangePlanActionContext();
    const { newSubscription } = props;
    const { subscription } = changePlanActionContext;
    const currentPlan = (newSubscription.plan.level === 'free' && newSubscription.plan.level === (subscription === null || subscription === void 0 ? void 0 : subscription.plan.level)) ||
        Subscriptions.isEqual(newSubscription, subscription);
    const buyingNewPlan = (subscription === null || subscription === void 0 ? void 0 : subscription.plan.level) === 'free';
    const text = buyingNewPlan ? "Purchase" : "Change Plan";
    const clickHandler = React.useCallback(() => {
        changePlanActionContext.action(newSubscription);
    }, [changePlanActionContext, newSubscription]);
    return (React.createElement("div", { style: { margin: '1rem' } },
        currentPlan && (React.createElement("span", { className: classes.current_plan }, "CURRENT PLAN")),
        !currentPlan && (React.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: clickHandler }, text))));
});
var Subscriptions;
(function (Subscriptions) {
    function isEqual(a, b) {
        return (a === null || a === void 0 ? void 0 : a.plan.level) === (b === null || b === void 0 ? void 0 : b.plan.level) && (a === null || a === void 0 ? void 0 : a.interval) === (b === null || b === void 0 ? void 0 : b.interval);
    }
    Subscriptions.isEqual = isEqual;
})(Subscriptions || (Subscriptions = {}));
//# sourceMappingURL=PurchaseOrChangePlanButton.js.map