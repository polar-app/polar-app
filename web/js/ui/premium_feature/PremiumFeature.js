"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumFeature = void 0;
const react_1 = __importDefault(require("react"));
const Analytics_1 = require("../../analytics/Analytics");
const UserInfoProvider_1 = require("../../apps/repository/auth_handler/UserInfoProvider");
const UpgradeButton_1 = require("./UpgradeButton");
const Plans_1 = require("polar-accounts/src/Plans");
exports.PremiumFeature = (props) => {
    const { required, feature } = props;
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    function onUpgrade() {
        Analytics_1.Analytics.event({ category: 'premium', action: 'upgrade-from-premium-feature-wall' });
        document.location.hash = "plans";
    }
    const PremiumFeatureWarningSM = () => {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(UpgradeButton_1.UpgradeButton, { required: required, feature: feature })));
    };
    const PremiumFeatureWarningMD = () => {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", { style: { filter: 'blur(8px)' } }, props.children),
            react_1.default.createElement("div", { className: "text-center mt-1" },
                react_1.default.createElement(UpgradeButton_1.UpgradeButton, { required: required, feature: feature }))));
    };
    const PremiumFeatureWarning = () => {
        const { size } = props;
        switch (size) {
            case "xs":
                return react_1.default.createElement(PremiumFeatureWarningSM, null);
            case "sm":
                return react_1.default.createElement(PremiumFeatureWarningSM, null);
            case "md":
                return react_1.default.createElement(PremiumFeatureWarningMD, null);
            case "lg":
                return react_1.default.createElement(PremiumFeatureWarningMD, null);
        }
    };
    const hasRequiredPlan = () => {
        var _a;
        if (!userInfoContext) {
            return false;
        }
        if (!userInfoContext.userInfo) {
            return false;
        }
        return Plans_1.Plans.hasLevel(required, (_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.subscription.plan);
    };
    if (hasRequiredPlan()) {
        return props.children;
    }
    else {
        return (react_1.default.createElement(PremiumFeatureWarning, null));
    }
};
//# sourceMappingURL=PremiumFeature.js.map