import {StripeUtils} from "../../impl/stripe/StripeUtils";
import {Firestore} from "../../impl/util/Firestore";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {UserInterviews} from "./UserInterviews";

export namespace SendgridCustomerUserInterviews {

    export async function acquireFirestoreLock(id: string) {

        const firestore = Firestore.getInstance();

        const ref = firestore.collection('user_interview');

        const doc = await ref.get();

    }

    export async function compute() {

        const gt = Date.now() - (2 * 7 * 24 * 60 * 60);

        const stripe = StripeUtils.getStripe('live');

        const customers = await stripe.customers.list({
            created: {
                gt
            }
        });

        for (const customer of customers.data) {

            const id = Hashcodes.createID(customer.email);

            const userInterview = await UserInterviews.get(id);

            if (! userInterview) {

                // figure out who is going to handle this one...
                //

                // UserInterviews.set(id, )

            }

        }

    }

}