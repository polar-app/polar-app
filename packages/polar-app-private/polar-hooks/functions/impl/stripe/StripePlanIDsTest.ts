import {assert} from 'chai';
import {StripePlanID, StripePlanIDs, StripeYearPlanID} from "./StripePlanIDs";
import { assertJSON } from 'polar-test/src/test/Assertions';

describe('StripePlanIDs', function() {

    it("toAccountPlan", async function() {
        assertJSON(StripePlanIDs.toAccountPlan(StripeYearPlanID.BRONZE), {"interval": "year", "plan": "bronze" });
        assertJSON(StripePlanIDs.toAccountPlan(StripeYearPlanID.SILVER), {"interval": "year", "plan": "silver" });
        assertJSON(StripePlanIDs.toAccountPlan(StripeYearPlanID.GOLD), {"interval": "year", "plan": "gold" });

        assertJSON(StripePlanIDs.toAccountPlan(StripePlanID.BRONZE), {"interval": "month", "plan": "bronze" });
        assertJSON(StripePlanIDs.toAccountPlan(StripePlanID.SILVER), {"interval": "month", "plan": "silver" });
        assertJSON(StripePlanIDs.toAccountPlan(StripePlanID.GOLD), {"interval": "month", "plan": "gold" });

        assertJSON(StripePlanIDs.toAccountPlan(<any> 'plan_bronze'), {"interval": "month", "plan": "bronze" });
        assertJSON(StripePlanIDs.toAccountPlan(<any> 'plan_silver'), {"interval": "month", "plan": "silver" });
        assertJSON(StripePlanIDs.toAccountPlan(<any> 'plan_gold'), {"interval": "month", "plan": "gold" });

        assertJSON(StripePlanIDs.toAccountPlan(<any> 'plan_bronze_year'), {"interval": "year", "plan": "bronze" });
        assertJSON(StripePlanIDs.toAccountPlan(<any> 'plan_silver_year'), {"interval": "year", "plan": "silver" });
        assertJSON(StripePlanIDs.toAccountPlan(<any> 'plan_gold_year'), {"interval": "year", "plan": "gold" });
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


