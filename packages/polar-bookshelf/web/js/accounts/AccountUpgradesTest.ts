import {assert} from 'chai';
import {AccountUpgrades, AccountUsage} from "./AccountUpgrades";
import {TestingTime} from 'polar-shared/src/test/TestingTime';
import {Plans} from 'polar-accounts/src/Plans';
import {Billing} from "polar-accounts/src/Billing";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Bytes} from "polar-shared/src/util/Bytes";
import V2Plan = Billing.V2Plan;
import V2PlanFree = Billing.V2PlanFree;
import isV2Grandfathered = AccountUpgrades.isV2Grandfathered;
import IRequiredPlan = AccountUpgrades.IRequiredPlan;

describe('AccountUpgrades', function() {

    beforeEach(() => {
        TestingTime.freeze()
    });

    afterEach(() => {
        TestingTime.unfreeze()
    });

    it("isV2Grandfathered", function() {
        assert.isTrue(isV2Grandfathered('2012-03-02T11:38:49.321Z'));
        assert.isTrue(isV2Grandfathered('2020-09-02T00:00:00.000Z'));
        assert.isFalse(isV2Grandfathered('2020-10-16T00:00:00.000Z'));
    });

    it("computePlanRequiredForAccount", function() {

        const created = new Date().toISOString();

        function doTest(currentPlan: V2Plan,
                        accountUsage: AccountUsage,
                        expected: IRequiredPlan) {

            const requiredPlan = AccountUpgrades.computePlanRequiredForAccount(Plans.toV2('free'), accountUsage);
            console.log("requiredPlan: ", requiredPlan);
            assertJSON(requiredPlan, expected);
        }

        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('200MB'), nrWebCaptures: 0, created}, {
            "plan": {
                "level": "free",
                "ver": "v2"
            },
            "reason": "none"
        });

        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('400MB'), nrWebCaptures: 0, created}, {
            "plan": {
                "level": "free",
                "ver": "v2"
            },
            "reason": "none"
        });

        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('900MB'), nrWebCaptures: 0, created}, {
            "plan": {
                "level": "free",
                "ver": "v2"
            },
            "reason": "none"
        });

        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('1GB'), nrWebCaptures: 0, created}, {
            "plan": {
                "level": "free",
                "ver": "v2"
            },
            "reason": "none"
        });

        doTest(V2PlanFree, {storageInBytes: Bytes.toBytes('2GB'), nrWebCaptures: 0, created}, {
            "plan": {
                "level": "plus",
                "ver": "v2"
            },
            "reason": "storage"
        });

    });

});
