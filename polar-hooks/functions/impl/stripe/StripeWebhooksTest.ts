import {StripeWebhooks} from "./StripeWebhooks";
import {StripeTesting} from "./StripeTesting";
import {StripeUtils} from "./StripeUtils";
import {StripePlanIDs} from "./StripePlanIDs";

describe('StripeWebhooks', function() {

    it("basic", async function() {
        this.timeout(60000);

        const stripe = StripeUtils.getStripe('test');

        const customer = await StripeTesting.createCustomer();

        const priceID = StripePlanIDs.fromSubscription('test', 'plus', 'month');

        const price = await stripe.prices.retrieve(priceID);

        function toProductID(): string {
            if (typeof price.product === 'string') {
                return price.product
            } else {
                return price.product.id;
            }
        }
        const planID = toProductID();

        console.log("planID: " + planID);

        const subscription = await StripeTesting.createSubscription(customer, priceID)

        await StripeWebhooks.handleEvent({
            stripeMode: 'test',
            eventType: 'customer.subscription.updated',
            value: {
                customerID: customer.id,
                status: 'active',
                subscriptionID: subscription.id,
                planID: price.id
            }
        })

    });

});


