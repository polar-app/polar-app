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
exports.UpgradeAccountButton = void 0;
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const Analytics_1 = require("../../../../web/js/analytics/Analytics");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const UserInfoProvider_1 = require("../../../../web/js/apps/repository/auth_handler/UserInfoProvider");
exports.UpgradeAccountButton = () => {
    var _a;
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    function onUpgrade() {
        Analytics_1.Analytics.event({ category: 'premium', action: 'upgrade-account-button' });
    }
    if (((_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.subscription.plan) === 'gold') {
        return null;
    }
    return (React.createElement(react_router_dom_1.Link, { to: { pathname: '/plans' } },
        React.createElement(Button_1.default, { variant: "contained", onClick: () => onUpgrade(), className: "border border-success" }, "Upgrade Account")));
};
//# sourceMappingURL=UpgradeAccountButton.js.map