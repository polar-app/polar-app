import {assert} from 'chai';
import {StripePlanID, StripePlanIDs, StripeYearPlanID} from "./StripePlanIDs";

describe('StripePlanIDs', function() {

    it("basic", async function() {
        assert.equal(StripePlanIDs.toAccountPlan(StripeYearPlanID.BRONZE), 'bronze');
        assert.equal(StripePlanIDs.toAccountPlan(StripeYearPlanID.SILVER), 'silver');
        assert.equal(StripePlanIDs.toAccountPlan(StripeYearPlanID.GOLD), 'gold');

        assert.equal(StripePlanIDs.toAccountPlan(StripePlanID.BRONZE), 'bronze');
        assert.equal(StripePlanIDs.toAccountPlan(StripePlanID.SILVER), 'silver');
        assert.equal(StripePlanIDs.toAccountPlan(StripePlanID.GOLD), 'gold');

        assert.equal(StripePlanIDs.toAccountPlan(<any> 'plan_bronze'), 'bronze');
        assert.equal(StripePlanIDs.toAccountPlan(<any> 'plan_silver'), 'silver');
        assert.equal(StripePlanIDs.toAccountPlan(<any> 'plan_gold'), 'gold');

        assert.equal(StripePlanIDs.toAccountPlan(<any> 'plan_bronze_year'), 'bronze');
        assert.equal(StripePlanIDs.toAccountPlan(<any> 'plan_silver_year'), 'silver');
        assert.equal(StripePlanIDs.toAccountPlan(<any> 'plan_gold_year'), 'gold');

    });

});


