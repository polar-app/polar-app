"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountAuthButton = void 0;
const react_1 = __importDefault(require("react"));
const LoginButton_1 = require("./LoginButton");
const AccountControlDropdown_1 = require("./AccountControlDropdown");
const AccountActions_1 = require("../../accounts/AccountActions");
const UserInfoProvider_1 = require("../../apps/repository/auth_handler/UserInfoProvider");
exports.AccountAuthButton = react_1.default.memo(() => {
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    if (!userInfoContext) {
        return null;
    }
    function enableCloudSync() {
        AccountActions_1.AccountActions.login();
    }
    if (!userInfoContext.userInfo) {
        return react_1.default.createElement(LoginButton_1.LoginButton, { onClick: () => enableCloudSync() });
    }
    return react_1.default.createElement(AccountControlDropdown_1.AccountControlDropdown, { userInfo: userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo });
});
//# sourceMappingURL=AccountAuthButton.js.map