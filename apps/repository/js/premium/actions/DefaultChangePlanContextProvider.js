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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultChangePlanContextProvider = void 0;
const React = __importStar(require("react"));
const AccountActions_1 = require("../../../../../web/js/accounts/AccountActions");
const MUIDialogControllers_1 = require("../../../../../web/js/mui/dialogs/MUIDialogControllers");
const MUILogger_1 = require("../../../../../web/js/mui/MUILogger");
const ChangePlanAction_1 = require("./ChangePlanAction");
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const UserInfoProvider_1 = require("../../../../../web/js/apps/repository/auth_handler/UserInfoProvider");
const UseStripeCheckout_1 = require("./UseStripeCheckout");
function usePurchaseOrChangePlanAction() {
    const dialogManager = MUIDialogControllers_1.useDialogManager();
    const log = MUILogger_1.useLogger();
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    const currentSubscription = UserInfoProvider_1.useUserSubscriptionContext();
    const stripeCheckout = UseStripeCheckout_1.useStripeCheckout();
    return React.useCallback((newSubscription) => {
        var _a;
        console.log("Attempting to change to ", newSubscription);
        const { interval, plan } = newSubscription;
        const email = (_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.email;
        const buyHandler = () => {
            const doAsync = () => __awaiter(this, void 0, void 0, function* () {
                dialogManager.snackbar({ message: 'One moment.  About to setup your purchase... ' });
                yield stripeCheckout(newSubscription, email);
            });
            doAsync().catch(err => log.error(err));
        };
        const changeHandler = () => {
            const onAccept = () => {
                dialogManager.snackbar({ message: `Changing plan to ${plan.level} billed at interval ${interval}.  One moment...` });
                AccountActions_1.AccountActions.changePlan(plan.level, interval)
                    .catch(err => log.error("Unable to upgrade plan: ", err));
            };
            dialogManager.confirm({
                title: `Are you sure you want to change to ${plan.level} (${interval})?`,
                subtitle: 'Your billing will automatically be updated and account pro-rated.',
                type: 'warning',
                onAccept
            });
        };
        const buyingNewPlan = currentSubscription.plan.level === 'free' || newSubscription.interval === '4year';
        if (buyingNewPlan) {
            buyHandler();
        }
        else {
            changeHandler();
        }
    }, [dialogManager, log, userInfoContext, currentSubscription, stripeCheckout]);
}
exports.DefaultChangePlanContextProvider = ReactUtils_1.deepMemo((props) => {
    const type = 'change';
    const action = usePurchaseOrChangePlanAction();
    const subscription = UserInfoProvider_1.useUserSubscriptionContext();
    return (React.createElement(ChangePlanAction_1.ChangePlanActionContext.Provider, { value: { type, action, subscription } }, props.children));
});
//# sourceMappingURL=DefaultChangePlanContextProvider.js.map