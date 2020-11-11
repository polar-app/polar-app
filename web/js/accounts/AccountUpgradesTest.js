"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const AccountUpgrades_1 = require("./AccountUpgrades");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const Plans_1 = require("polar-accounts/src/Plans");
const Billing_1 = require("polar-accounts/src/Billing");
var V2PlanPlus = Billing_1.Billing.V2PlanPlus;
const Assertions_1 = require("../test/Assertions");
var V2PlanFree = Billing_1.Billing.V2PlanFree;
const Bytes_1 = require("polar-shared/src/util/Bytes");
var isV2Grandfathered = AccountUpgrades_1.AccountUpgrades.isV2Grandfathered;
TestingTime_1.TestingTime.freeze();
describe('AccountUpgrades', function () {
    it("isV2Grandfathered", function () {
        chai_1.assert.isTrue(isV2Grandfathered('2012-03-02T11:38:49.321Z'));
        chai_1.assert.isTrue(isV2Grandfathered('2020-09-02T00:00:00.000Z'));
        chai_1.assert.isFalse(isV2Grandfathered('2020-10-16T00:00:00.000Z'));
    });
    it("computePlanRequiredForAccount", function () {
        const created = new Date().toISOString();
        function doTest(currentPlan, accountUsage, expected) {
            const requiredPlan = AccountUpgrades_1.AccountUpgrades.computePlanRequiredForAccount(Plans_1.Plans.toV2('free'), accountUsage);
            console.log("requiredPlan: ", requiredPlan);
            Assertions_1.assertJSON(requiredPlan, expected);
        }
        doTest(V2PlanFree, { storageInBytes: Bytes_1.Bytes.toBytes('200MB'), created }, V2PlanFree);
        doTest(V2PlanFree, { storageInBytes: Bytes_1.Bytes.toBytes('400MB'), created }, V2PlanFree);
        doTest(V2PlanFree, { storageInBytes: Bytes_1.Bytes.toBytes('900MB'), created }, V2PlanFree);
        doTest(V2PlanFree, { storageInBytes: Bytes_1.Bytes.toBytes('1GB'), created }, V2PlanFree);
        doTest(V2PlanFree, { storageInBytes: Bytes_1.Bytes.toBytes('2GB'), created }, V2PlanPlus);
    });
});
//# sourceMappingURL=AccountUpgradesTest.js.map