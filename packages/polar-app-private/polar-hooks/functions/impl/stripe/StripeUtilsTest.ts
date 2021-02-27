import {assert} from 'chai';
import {StripePlanIDs} from "./StripePlanIDs";
import { assertJSON } from 'polar-test/src/test/Assertions';
import { StripeUtils } from './StripeUtils';

describe('StripeUtils', async function() {

    xit("basic", async function() {

        const stripe = await StripeUtils.getStripe('test')

        const cs = await stripe.checkout.sessions.retrieve('cs_test_6QxqdN5bdDotfCfpwJynEA8uIiyhDgGfQOrs5uKcDAuDVBdaLzz8kI5y');


        console.log("cs: ", cs)
        console.log("line items: ", cs.line_items)

    });


});


