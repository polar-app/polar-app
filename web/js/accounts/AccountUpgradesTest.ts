import {assert} from 'chai';
import {AccountUpgrades} from "./AccountUpgrades";
import { TestingTime } from 'polar-shared/src/test/TestingTime';
import { Plans } from 'polar-accounts/src/Plans';
import {Billing} from "polar-accounts/src/Billing";
import V2PlanPlus = Billing.V2PlanPlus;
import V2PlanPro = Billing.V2PlanPro;

TestingTime.freeze()

describe('AccountUpgrades', function() {

    it("upgradeRequired", function() {

        const created = new Date().toISOString();

        assert.isUndefined(AccountUpgrades.computePlanRequiredForAccount(Plans.toV2('free'), {storageInBytes: 200000000, created}));
        assert.equal(AccountUpgrades.computePlanRequiredForAccount(Plans.toV2('free'), {storageInBytes: 400000000, created}), V2PlanPlus);
        assert.equal(AccountUpgrades.computePlanRequiredForAccount(Plans.toV2('bronze'), {storageInBytes: 6000000000, created}), V2PlanPro);

    });

});
