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
exports.CancelSubscriptionButton = void 0;
const React = __importStar(require("react"));
const UserInfoProvider_1 = require("../../../../web/js/apps/repository/auth_handler/UserInfoProvider");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const AccountActions_1 = require("../../../../web/js/accounts/AccountActions");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const Functions_1 = require("polar-shared/src/util/Functions");
exports.CancelSubscriptionButton = () => {
    const currentSubscription = UserInfoProvider_1.useUserSubscriptionContext();
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const asyncActionTaskbar = MUIDialogControllers_1.useAsyncActionTaskbar();
    const handleCancelSubscription = React.useCallback(() => {
        asyncActionTaskbar({
            message: "Cancelling your subscription. Just a moment",
            action: AccountActions_1.AccountActions.cancelSubscription
        });
    }, [asyncActionTaskbar]);
    const handleClick = React.useCallback(() => {
        dialogs.confirm({
            title: "Are you sure you want to cancel your subscription?",
            subtitle: "We'd hate to see you go but appreciate all your support!",
            type: 'danger',
            onCancel: Functions_1.NULL_FUNCTION,
            onAccept: handleCancelSubscription
        });
    }, [dialogs, handleCancelSubscription]);
    if (currentSubscription.plan.level === 'free') {
        return null;
    }
    return (React.createElement(Button_1.default, { variant: "contained", onClick: handleClick }, "Cancel Subscription"));
};
//# sourceMappingURL=CancelSubscriptionButton.js.map