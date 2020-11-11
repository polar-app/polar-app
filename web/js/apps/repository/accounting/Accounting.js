"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccountingUsage = exports.useAccounting = void 0;
const DocRepoStore2_1 = require("../../../../../apps/repository/js/doc_repo/DocRepoStore2");
const Reducers_1 = require("polar-shared/src/util/Reducers");
const UserInfoProvider_1 = require("../auth_handler/UserInfoProvider");
const Plans_1 = require("polar-accounts/src/Plans");
const AccountUpgrades_1 = require("../../../accounts/AccountUpgrades");
var computeStorageForPlan = AccountUpgrades_1.AccountUpgrades.computeStorageForPlan;
const Percentages_1 = require("polar-shared/src/util/Percentages");
function useAccounting() {
    const { data } = DocRepoStore2_1.useDocRepoStore(['data']);
    const storage = data.map(current => current.docInfo.bytes || 0)
        .reduce(Reducers_1.Reducers.SUM, 0);
    const nrWebCaptures = data.filter(current => current.docInfo.webCapture)
        .length;
    return { storage, nrWebCaptures };
}
exports.useAccounting = useAccounting;
function useAccountingUsage() {
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    const accounting = useAccounting();
    function computeStorage() {
        var _a, _b;
        const plan = Plans_1.Plans.toV2(((_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.subscription.plan) || 'free');
        const value = accounting.storage;
        const limit = computeStorageForPlan((_b = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _b === void 0 ? void 0 : _b.creationTime, plan);
        const usage = Percentages_1.Percentages.calculate(value, limit);
        return {
            value, limit, usage
        };
    }
    function computeWebCaptures() {
        var _a;
        const plan = Plans_1.Plans.toV2(((_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.subscription.plan) || 'free');
        const value = accounting.nrWebCaptures;
        const limit = plan.level === 'free' ? 250 : undefined;
        if (limit === undefined) {
            return {
                value, limit: undefined, usage: undefined
            };
        }
        else {
            const usage = Percentages_1.Percentages.calculate(value, limit);
            return {
                value, limit, usage
            };
        }
    }
    const storage = computeStorage();
    const webCaptures = computeWebCaptures();
    return { storage, webCaptures };
}
exports.useAccountingUsage = useAccountingUsage;
//# sourceMappingURL=Accounting.js.map