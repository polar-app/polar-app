import {StripeUtils} from './StripeUtils';

describe('StripeUtils', function() {

    xit("basic", async function() {

        const stripe = StripeUtils.getStripe('test')

        const cs = await stripe.checkout.sessions.retrieve('cs_test_6QxqdN5bdDotfCfpwJynEA8uIiyhDgGfQOrs5uKcDAuDVBdaLzz8kI5y');


        console.log("cs: ", cs)
        console.log("line items: ", cs.line_items)

    });


});


