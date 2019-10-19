import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {FirebaseAdmin} from '../util/FirebaseAdmin';
import {StripeUtils} from './StripeUtils';
import {ISODateTimeString} from "polar-shared/src/metadata/ISODateTimeStrings";

// TODO:
//
// - implement signing for webhooks: https://stripe.com/docs/webhooks/signatures

const firebase = FirebaseAdmin.app();
const firestore = firebase.firestore();
const auth = firebase.auth();

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    // req.body should be a JSON body for stripe with the payment metadata.

    const handleRequest = async () => {

        console.log(JSON.stringify(req.body, null,  '  '));

        const stripeEvent: StripeEvent = req.body;

        const customerID = stripeEvent.data.object.customer;

        const planID = <StripePlanID> stripeEvent.data.object.plan.id;

        const plan = StripePlansIDs.toAccountPlan(planID);

        switch (stripeEvent.type) {

            case 'customer.subscription.created':
                await Accounts.changePlan(customerID, plan);
                break;
            case 'customer.subscription.updated':
                await Accounts.changePlan(customerID, plan);
                break;
            case 'customer.subscription.deleted':
                await Accounts.changePlan(customerID, 'free');
                break;

        }

    };

    handleRequest()
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            const now = Date.now();
            console.error(`Could properly handle webhook: ${now}`, err);
            console.error(`JSON body for failed webhook: ${now}`, JSON.stringify(req.body, null,  '  '));
            res.sendStatus(500);
        });

});

export const StripeWebhookFunction = functions.https.onRequest(app);

export enum StripePlanID {

    // GOLD = "plan_F9ChPwDqC5atBi",
    // SILVER = "plan_F9ChOnIPEr8yKA",
    // BRONZE = "plan_F9Cgv6rpQtKHaJ"

    GOLD = "plan_gold",
    SILVER = "plan_silver",
    BRONZE = "plan_bronze"

}

export class StripePlansIDs {

    public static toAccountPlan(planID: StripePlanID): AccountPlan {

        switch (planID) {
            case StripePlanID.GOLD:
                return 'gold';
            case StripePlanID.SILVER:
                return 'silver';
            case StripePlanID.BRONZE:
                return 'bronze';
            default:
                throw new Error("Invalid product: " + planID);
        }

    }

    public static fromAccountPlan(plan: AccountPlan): StripePlanID {

        if (! plan) {
            throw new Error("No plan");
        }

        if (plan.startsWith("bronze")) {
            return StripePlanID.BRONZE;
        }

        if (plan.startsWith("silver")) {
            return StripePlanID.SILVER;
        }

        if (plan.startsWith("gold")) {
            return StripePlanID.GOLD;
        }

        throw new Error("Invalid plan: " + plan);

    }

}


export interface StripeEvent {

    readonly type: "customer.subscription.created" | "customer.subscription.deleted" | "customer.subscription.updated";

    readonly data: StripeEventData;

}

export interface StripeEventData {
    readonly object: StripeEventSubscriptionObject;
}

export interface StripeEventSubscriptionObject {
    readonly plan: StripeEventPlan;
    readonly customer: string;
}

export interface StripeEventPlan {
    readonly id: string;
    readonly product: string;
}


interface AccountInit {

    readonly plan: AccountPlan;

}

export class Accounts {

    /**
     * Validate that the given HTTP request has the right uid or someone
     * is just trying to monkey with someone's account.
     */
    public static async validate(email: string, uid: string) {

        const user = await auth.getUserByEmail(email);

        if (! user) {
            throw new Error("No user for email: " + email);
        }

        if (user.uid !== uid) {
            throw new Error("Params not validated");
        }

    }

    public static async changePlan(customerID: string, plan: AccountPlan) {

        const stripe = StripeUtils.getStripe();

        const customer = await stripe.customers.retrieve(customerID);

        const {email} = customer;

        await this.changePlanViaEmail(email, plan);

    }


    public static async changePlanViaEmail(email: string | undefined | null, plan: AccountPlan) {

        if (! email) {
            throw new Error("Customer has no email address");
        }

        const user = await auth.getUserByEmail(email);

        const lastModified = new Date().toISOString();

        const account: Account = {
            id: user.uid,
            uid: user.uid,
            plan,
            email,
            lastModified
        };

        await Accounts.write(account);

    }

    public static async get(email: string): Promise<Account | undefined> {

        const query = firestore
            .collection('account')
            .where('email', '==', email)
            .limit(1);

        const querySnapshot = await query.get();

        if (querySnapshot.empty) {
            return undefined;
        }

        const doc = querySnapshot.docs[0].data();

        return <Account> doc;

    }


    public static async write(account: Account) {

        const ref = firestore
            .collection('account')
            .doc(account.id);

        await ref.set(account);

    }


}

export interface Account extends AccountInit {

    readonly id: string;

    /**
     * The users uid in Firebase.
     */
    readonly uid: string;

    /**
     * The accounts primary email address.  We might add more in the future.
     */
    readonly email: string;

    /**
     * The last time any important action was changed on the account. Payment
     * updated, etc.
     */
    readonly lastModified: ISODateTimeString;

}

export type AccountPlan = 'free' | 'bronze' | 'silver' | 'gold';
