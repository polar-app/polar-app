"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountControl = void 0;
const react_1 = __importDefault(require("react"));
const AccountOverview_1 = require("../../../../apps/repository/js/account_overview/AccountOverview");
const Analytics_1 = require("../../analytics/Analytics");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const MUIRouterLink_1 = require("../../mui/MUIRouterLink");
const AccountAvatar_1 = require("./AccountAvatar");
const ReactUtils_1 = require("../../react/ReactUtils");
const AccountHooks_1 = require("../../accounts/AccountHooks");
const MUIDialogControllers_1 = require("../../mui/dialogs/MUIDialogControllers");
const MUIPopper_1 = require("../../mui/menu/MUIPopper");
const PlanUsage_1 = require("../../apps/repository/accounting/PlanUsage");
const LogoutButton = (props) => {
    return react_1.default.createElement(Button_1.default, { id: "cloud-sync-logout", color: "secondary", onClick: () => props.onLogout() }, "Logout");
};
const ViewPlansAndPricingButton = () => {
    const popperController = MUIPopper_1.usePopperController();
    const handler = () => {
        Analytics_1.Analytics.event({ category: 'premium', action: 'view-plans-and-pricing-button' });
        popperController.dismiss();
    };
    return (react_1.default.createElement(MUIRouterLink_1.MUIRouterLink, { to: '/plans' },
        react_1.default.createElement(Button_1.default, { color: "secondary", variant: "contained", size: "large", onClick: handler },
            react_1.default.createElement("i", { className: "fas fa-certificate" }),
            "\u00A0 View Plans and Pricing")));
};
function useLogoutAction() {
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const logoutCallback = AccountHooks_1.useLogoutCallback();
    return () => {
        dialogs.confirm({
            type: 'danger',
            title: "Are you sure you want to logout?",
            subtitle: "Just wanted to double check. Are you sure you want to logout?",
            onAccept: logoutCallback
        });
    };
}
exports.AccountControl = ReactUtils_1.memoForwardRefDiv((props, ref) => {
    const logoutAction = useLogoutAction();
    const popperController = MUIPopper_1.usePopperController();
    function handleLogout() {
        popperController.dismiss();
        logoutAction();
    }
    return (react_1.default.createElement("div", { style: { padding: '10px 20px' }, ref: ref },
        react_1.default.createElement("div", null,
            react_1.default.createElement("div", { className: "text-center" },
                react_1.default.createElement("div", { style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    } },
                    react_1.default.createElement(AccountAvatar_1.AccountAvatar, { size: "large", style: { width: '100px', height: '100px' } })),
                react_1.default.createElement("div", { className: "p-1" },
                    react_1.default.createElement("div", { className: "text-lg", style: { fontWeight: 'bold' } }, props.userInfo.displayName || 'Anonymous'),
                    react_1.default.createElement("div", { className: "text-muted text-md", style: {} }, props.userInfo.email || ''))),
            react_1.default.createElement("div", { className: "mt-2 pb-2 border-top text-center" },
                react_1.default.createElement("div", { className: "mt-4 mb-4" },
                    react_1.default.createElement(PlanUsage_1.PlanUsage, null)),
                react_1.default.createElement("div", { className: "mt-2 mb-4" },
                    react_1.default.createElement(AccountOverview_1.AccountOverview, { subscription: props.userInfo.subscription })),
                react_1.default.createElement(ViewPlansAndPricingButton, null)),
            react_1.default.createElement("div", { className: "text-right" },
                react_1.default.createElement("div", { style: { display: 'flex', whiteSpace: 'nowrap' }, className: "mt-2" },
                    react_1.default.createElement("div", { className: "ml-auto" }),
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(LogoutButton, { onLogout: handleLogout })))))));
});
//# sourceMappingURL=AccountControl.js.map