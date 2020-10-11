import {StripeCreateSessions} from "./StripeCreateSessions";
import {Billing} from "polar-accounts/src/Billing";
import {StripeCustomers} from "./StripeCustomers";
import {StripeUtils} from "./StripeUtils";
import IStripeSession = StripeCreateSessions.IStripeSession;
import {assert} from 'chai';

describe('StripeCreateSessions', function() {

    const email = 'alice@example.com'

    async function purgeCustomer() {
        const customer = await StripeCustomers.getCustomerByEmail('test', email);
        if (customer) {
            const stripe = StripeUtils.getStripe('test');
            await stripe.customers.del(customer.id);
        }
    }

    async function createCustomer() {
        const stripe = StripeUtils.getStripe('test');
        return await stripe.customers.create({email});
    }

    it("basic", async function() {

        this.timeout(10000);

        async function doTest(validator: (session: IStripeSession) => void) {

            const intervals: ReadonlyArray<Billing.Interval> = ['month', 'year'];
            const plans: ReadonlyArray<Billing.V2PlanLevel> = ['plus', 'pro'];

            for (const interval of intervals) {
                for (const plan of plans) {
                    const session = await StripeCreateSessions.create({
                        stripeMode: 'test',
                        email,
                        interval,
                        plan,
                    });

                    console.log("session: ", JSON.stringify(session, null, '  '));
                    validator(session);

                }
            }

        }

        await purgeCustomer();
        await doTest(session => assert.equal((<any> session.customerParams).customer_email, email));

        const customer = await createCustomer();
        await doTest(session => assert.equal((<any> session.customerParams).customer, customer.id));

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