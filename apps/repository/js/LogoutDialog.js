"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutDialog = void 0;
const react_1 = __importDefault(require("react"));
const react_router_dom_1 = require("react-router-dom");
const ConfirmDialog_1 = require("../../../web/js/ui/dialogs/ConfirmDialog");
const AccountHooks_1 = require("../../../web/js/accounts/AccountHooks");
exports.LogoutDialog = () => {
    const history = react_router_dom_1.useHistory();
    const doLogout = AccountHooks_1.useLogoutCallback();
    function goBack() {
        history.replace({ hash: "" });
    }
    function handleClose() {
        goBack();
    }
    function handleLogout() {
        goBack();
        doLogout();
    }
    console.log("Asking user if they want to logout");
    return (react_1.default.createElement(ConfirmDialog_1.ConfirmDialog, { type: 'danger', title: "Are you sure you want to logout?", subtitle: "Just wanted to double check. Are you sure you want to logout?", onCancel: handleClose, onAccept: handleLogout }));
};
//# sourceMappingURL=LogoutDialog.js.map