"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountUpgrades = void 0;
const Billing_1 = require("polar-accounts/src/Billing");
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const Plans_1 = require("polar-accounts/src/Plans");
var V2PlanPlus = Billing_1.Billing.V2PlanPlus;
var V2PlanFree = Billing_1.Billing.V2PlanFree;
var V2PlanPro = Billing_1.Billing.V2PlanPro;
const _1GB = 1000000000;
const _2GB = 2000000000;
const _50GB = 50000000000;
const _500GB = 500000000000;
var AccountUpgrades;
(function (AccountUpgrades) {
    function isV2Grandfathered(created) {
        return ISODateTimeStrings_1.ISODateTimeStrings.compare(created, '2020-10-15T00:00:00+0000') < 0;
    }
    AccountUpgrades.isV2Grandfathered = isV2Grandfathered;
    function computeStorageForPlan(accountCreated, plan) {
        const grandfathered = accountCreated !== undefined ? isV2Grandfathered(accountCreated) : false;
        switch (plan.level) {
            case 'free':
                return grandfathered ? _2GB : _1GB;
            case 'plus':
                return _50GB;
            case 'pro':
                return _500GB;
        }
    }
    AccountUpgrades.computeStorageForPlan = computeStorageForPlan;
    function computeRequiredPlan(accountUsage) {
        function computePlan(free, plus, pro) {
            if (accountUsage.storageInBytes < free) {
                return V2PlanFree;
            }
            if (accountUsage.storageInBytes >= free && accountUsage.storageInBytes < plus) {
                return V2PlanPlus;
            }
            if (accountUsage.storageInBytes >= plus && accountUsage.storageInBytes < pro) {
                return V2PlanPro;
            }
            throw new Error("Too much storage: " + accountUsage.storageInBytes);
        }
        function computeV2Grandfathered() {
            return computePlan(_2GB, _50GB, _500GB);
        }
        function computeV2() {
            return computePlan(_1GB, _50GB, _500GB);
        }
        if (isV2Grandfathered(accountUsage.created)) {
            return computeV2Grandfathered();
        }
        else {
            return computeV2();
        }
    }
    AccountUpgrades.computeRequiredPlan = computeRequiredPlan;
    function computePlanRequiredForAccount(currentPlan, accountUsage) {
        const requiredPlan = computeRequiredPlan(accountUsage);
        if (Plans_1.Plans.toInt(currentPlan) < Plans_1.Plans.toInt(requiredPlan)) {
            return requiredPlan;
        }
        return currentPlan;
    }
    AccountUpgrades.computePlanRequiredForAccount = computePlanRequiredForAccount;
})(AccountUpgrades = exports.AccountUpgrades || (exports.AccountUpgrades = {}));
//# sourceMappingURL=AccountUpgrades.js.map