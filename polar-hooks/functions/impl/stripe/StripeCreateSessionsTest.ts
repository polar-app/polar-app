import {StripeCreateSessions} from "./StripeCreateSessions";
import {Billing} from "polar-accounts/src/Billing";

describe('StripeCreateSessions', function() {

    it("basic", async function() {

        this.timeout(10000);

        const intervals: ReadonlyArray<Billing.Interval> = ['month', 'year'];
        const plans: ReadonlyArray<Billing.V2PlanLevel> = ['plus', 'pro'];

        for (const interval of intervals) {
            for (const plan of plans) {
                await StripeCreateSessions.create({
                    stripeMode: 'test',
                    email: 'alice@example.com',
                    interval,
                    plan,
                });

            }
        }

        // await StripeCreateSessions.create({
        //     stripeMode: 'test',
        //     email: 'alice@example.com',
        //     interval: '4year',
        //     plan: 'plus',
        // });
        //
        // await StripeCreateSessions.create({
        //     stripeMode: 'test',
        //     email: 'alice@example.com',
        //     interval: '4year',
        //     plan: 'pro',
        // });

    });

});