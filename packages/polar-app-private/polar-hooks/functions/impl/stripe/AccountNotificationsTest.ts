import {AccountNotifications} from "./AccountNotifications";
import {Billing} from "polar-accounts/src/Billing";
import V2PlanFree = Billing.V2PlanFree;
import V2PlanPlus = Billing.V2PlanPlus;

describe('AccountNotifications', function() {

    it("basic #1", async function() {

        await AccountNotifications.changePlan({plan: V2PlanFree, interval: 'month'},
                                              {plan: V2PlanPlus, interval: 'month'},
                                              {email: 'burton@getpolarized.io', displayName: 'Kevin Burton', uid: '12345'});

    });

});
