import {assert} from 'chai';
import {StripePlanID, StripePlanIDs, StripeYearPlanID} from "./StripePlanIDs";

describe('StripePlanIDs', function() {

    it("toAccountPlan", async function() {
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

    it("fromAccountPlan", async function() {
        assert.equal(StripePlanIDs.fromAccountPlan('bronze', 'year'), 'plan_bronze_year');
        assert.equal(StripePlanIDs.fromAccountPlan('silver', 'year'), 'plan_silver_year');
        assert.equal(StripePlanIDs.fromAccountPlan('gold', 'year'), 'plan_gold_year');

        assert.equal(StripePlanIDs.fromAccountPlan('bronze', 'month'), 'plan_bronze');
        assert.equal(StripePlanIDs.fromAccountPlan('silver', 'month'), 'plan_silver');
        assert.equal(StripePlanIDs.fromAccountPlan('gold', 'month'), 'plan_gold');

    });


});


