"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUpgrader = exports.useAccountUpgrader = void 0;
const AccountUpgrades_1 = require("../../accounts/AccountUpgrades");
const Logger_1 = require("polar-shared/src/logger/Logger");
const UserInfoProvider_1 = require("../../apps/repository/auth_handler/UserInfoProvider");
const Plans_1 = require("polar-accounts/src/Plans");
const Accounting_1 = require("../../apps/repository/accounting/Accounting");
const log = Logger_1.Logger.create();
function useAccountUpgrader() {
    var _a, _b, _c;
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    const accounting = Accounting_1.useAccounting();
    if (!(userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo)) {
        return undefined;
    }
    const plan = Plans_1.Plans.toV2(((_b = (_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.subscription) === null || _b === void 0 ? void 0 : _b.plan) || 'free');
    const accountUsage = {
        created: (_c = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _c === void 0 ? void 0 : _c.creationTime,
        storageInBytes: accounting.nrWebCaptures
    };
    const toPlan = AccountUpgrades_1.AccountUpgrades.computePlanRequiredForAccount(plan, accountUsage);
    const required = plan.level !== toPlan.level;
    if (required) {
        log.warn(`Current account needs to be upgrade from ${plan.level} to ${toPlan}`);
    }
    return { required, toPlan };
}
exports.useAccountUpgrader = useAccountUpgrader;
class AccountUpgrader {
    startUpgrade() {
    }
}
exports.AccountUpgrader = AccountUpgrader;
//# sourceMappingURL=AccountUpgrader.js.map