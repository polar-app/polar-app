import {assert} from 'chai';
import {StripePlanID, StripePlanIDs, StripeYearPlanID} from "./StripePlanIDs";
import { assertJSON } from 'polar-test/src/test/Assertions';

describe('StripePlanIDs', function() {

    it("toAccountPlan", async function() {
        assertJSON(StripePlanIDs.toSubscription(StripeYearPlanID.BRONZE), {"interval": "year", "plan": "bronze" });
        assertJSON(StripePlanIDs.toSubscription(StripeYearPlanID.SILVER), {"interval": "year", "plan": "silver" });
        assertJSON(StripePlanIDs.toSubscription(StripeYearPlanID.GOLD), {"interval": "year", "plan": "gold" });

        assertJSON(StripePlanIDs.toSubscription(StripePlanID.BRONZE), {"interval": "month", "plan": "bronze" });
        assertJSON(StripePlanIDs.toSubscription(StripePlanID.SILVER), {"interval": "month", "plan": "silver" });
        assertJSON(StripePlanIDs.toSubscription(StripePlanID.GOLD), {"interval": "month", "plan": "gold" });

        assertJSON(StripePlanIDs.toSubscription(<any> 'plan_bronze'), {"interval": "month", "plan": "bronze" });
        assertJSON(StripePlanIDs.toSubscription(<any> 'plan_silver'), {"interval": "month", "plan": "silver" });
        assertJSON(StripePlanIDs.toSubscription(<any> 'plan_gold'), {"interval": "month", "plan": "gold" });

        assertJSON(StripePlanIDs.toSubscription(<any> 'plan_bronze_year'), {"interval": "year", "plan": "bronze" });
        assertJSON(StripePlanIDs.toSubscription(<any> 'plan_silver_year'), {"interval": "year", "plan": "silver" });
        assertJSON(StripePlanIDs.toSubscription(<any> 'plan_gold_year'), {"interval": "year", "plan": "gold" });
    });

    it("fromAccountPlan", async function() {
        assert.equal(StripePlanIDs.fromSubscription('bronze', 'year'), 'plan_bronze_year');
        assert.equal(StripePlanIDs.fromSubscription('silver', 'year'), 'plan_silver_year');
        assert.equal(StripePlanIDs.fromSubscription('gold', 'year'), 'plan_gold_year');

        assert.equal(StripePlanIDs.fromSubscription('bronze', 'month'), 'plan_bronze');
        assert.equal(StripePlanIDs.fromSubscription('silver', 'month'), 'plan_silver');
        assert.equal(StripePlanIDs.fromSubscription('gold', 'month'), 'plan_gold');
    });

});


