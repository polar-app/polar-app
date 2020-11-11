"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PremiumFeature = void 0;
var react_1 = require("react");
var Analytics_1 = require("../../analytics/Analytics");
var UserInfoProvider_1 = require("../../apps/repository/auth_handler/UserInfoProvider");
var UpgradeButton_1 = require("./UpgradeButton");
var Plans_1 = require("polar-accounts/src/Plans");
exports.PremiumFeature = function (props) {
    var required = props.required, feature = props.feature;
    var userInfoContext = UserInfoProvider_1.useUserInfoContext();
    function onUpgrade() {
        Analytics_1.Analytics.event({ category: 'premium', action: 'upgrade-from-premium-feature-wall' });
        document.location.hash = "plans";
    }
    var PremiumFeatureWarningSM = function () {
        return (<div>
                <UpgradeButton_1.UpgradeButton required={required} feature={feature}/>
            </div>);
    };
    var PremiumFeatureWarningMD = function () {
        return (<div>

                <div style={{ filter: 'blur(8px)' }}>
                    {props.children}
                </div>

                <div className="text-center mt-1">
                    <UpgradeButton_1.UpgradeButton required={required} feature={feature}/>
                </div>

            </div>);
    };
    var PremiumFeatureWarning = function () {
        var size = props.size;
        switch (size) {
            case "xs":
                return <PremiumFeatureWarningSM />;
            case "sm":
                return <PremiumFeatureWarningSM />;
            case "md":
                return <PremiumFeatureWarningMD />;
            case "lg":
                return <PremiumFeatureWarningMD />;
        }
    };
    var hasRequiredPlan = function () {
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
        return (<PremiumFeatureWarning />);
    }
};
