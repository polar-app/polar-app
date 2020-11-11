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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageSubscriptionButton = void 0;
const React = __importStar(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const AccountActions_1 = require("../../../../web/js/accounts/AccountActions");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const UserInfoProvider_1 = require("../../../../web/js/apps/repository/auth_handler/UserInfoProvider");
exports.ManageSubscriptionButton = React.memo(() => {
    const asyncActionTaskbar = MUIDialogControllers_1.useAsyncActionTaskbar();
    const currentSubscription = UserInfoProvider_1.useUserSubscriptionContext();
    const redirectToStripeCustomerPortal = AccountActions_1.AccountActions.useRedirectToStripeCustomerPortal();
    const handleClick = React.useCallback(() => {
        asyncActionTaskbar({
            message: "Sending you to the customer portal.  One moment",
            action: () => __awaiter(void 0, void 0, void 0, function* () { return yield redirectToStripeCustomerPortal(); })
        });
    }, [asyncActionTaskbar, redirectToStripeCustomerPortal]);
    if (currentSubscription.plan.level === 'free') {
        return null;
    }
    return (React.createElement(Button_1.default, { variant: "contained", onClick: handleClick }, "Manage Subscription"));
});
//# sourceMappingURL=ManageSubscriptionButton.js.map