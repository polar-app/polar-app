import {assert} from 'chai';
import {StripePlanIDs} from "./StripePlanIDs";
import { assertJSON } from 'polar-test/src/test/Assertions';

describe('StripePlanIDs', function() {

    it("toAccountPlan", async function() {
        // assertJSON(StripePlanIDs.toSubscription('test', StripeYearPlanID.BRONZE), {"interval": "year", "plan": "bronze" });
        // assertJSON(StripePlanIDs.toSubscription('test', StripeYearPlanID.SILVER), {"interval": "year", "plan": "silver" });
        // assertJSON(StripePlanIDs.toSubscription('test', StripeYearPlanID.GOLD), {"interval": "year", "plan": "gold" });
        //
        // assertJSON(StripePlanIDs.toSubscription('test', StripePlanID.BRONZE), {"interval": "month", "plan": "bronze" });
        // assertJSON(StripePlanIDs.toSubscription('test', StripePlanID.SILVER), {"interval": "month", "plan": "silver" });
        // assertJSON(StripePlanIDs.toSubscription('test', StripePlanID.GOLD), {"interval": "month", "plan": "gold" });

        assertJSON(StripePlanIDs.toSubscription('test', <any> 'plan_bronze'), {"interval": "month", "plan": "bronze" });
        assertJSON(StripePlanIDs.toSubscription('test', <any> 'plan_silver'), {"interval": "month", "plan": "silver" });
        assertJSON(StripePlanIDs.toSubscription('test', <any> 'plan_gold'), {"interval": "month", "plan": "gold" });

        assertJSON(StripePlanIDs.toSubscription('test', <any> 'plan_bronze_year'), {"interval": "year", "plan": "bronze" });
        assertJSON(StripePlanIDs.toSubscription('test', <any> 'plan_silver_year'), {"interval": "year", "plan": "silver" });
        assertJSON(StripePlanIDs.toSubscription('test', <any> 'plan_gold_year'), {"interval": "year", "plan": "gold" });
    });

    it("fromAccountPlan", async function() {
        assert.equal(StripePlanIDs.fromSubscription('test','bronze', 'year'), 'plan_bronze_year');
        assert.equal(StripePlanIDs.fromSubscription('test', 'silver', 'year'), 'plan_silver_year');
        assert.equal(StripePlanIDs.fromSubscription('test', 'gold', 'year'), 'plan_gold_year');

        assert.equal(StripePlanIDs.fromSubscription('test', 'bronze', 'month'), 'plan_bronze');
        assert.equal(StripePlanIDs.fromSubscription('test', 'silver', 'month'), 'plan_silver');
        assert.equal(StripePlanIDs.fromSubscription('test', 'gold', 'month'), 'plan_gold');
    });

});


