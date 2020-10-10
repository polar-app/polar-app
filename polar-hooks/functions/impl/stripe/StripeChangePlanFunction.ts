import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {Billing} from 'polar-accounts/src/Billing';
import {Accounts} from "./Accounts";
import {StripeCustomers} from "./StripeCustomers";
import {StripeCustomerAccounts} from "./StripeCustomerAccounts";
import { StripeMode } from './StripeUtils';
import { Plans } from 'polar-accounts/src/Plans';

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    // TODO: I think we need to validate the logged in user here.

    const handleRequest = async () => {

        try {

            console.log(JSON.stringify(req.body, null, '  '));

            const body: StripeChangePlanBody = req.body;

            const plan = Plans.toV2(body.plan);
            const account = await StripeCustomerAccounts.get(body.mode, body.email);

            await Accounts.validate(body.email, body.uid);
            await StripeCustomers.changePlan(body.mode, body.email, plan, body.interval);
            await Accounts.changePlanViaEmail(body.email, account.customer.customerID, plan, body.interval);

            res.sendStatus(200);

        } catch (err) {
            const now = Date.now();
            console.error(`Could not properly handle webhook: ${now}`, err);
            console.error(`JSON body for failed webhook: ${now}`, JSON.stringify(req.body, null,  '  '));
            res.sendStatus(500);
        }

    };

    handleRequest()
        .catch(err => console.error("Failed to handle request: ", err));

});

export const StripeChangePlanFunction = functions.https.onRequest(app);

export interface StripeChangePlanBody {
    readonly uid: string;
    readonly email: string;
    readonly plan: Billing.PlanLike;
    readonly interval: Billing.Interval;
    readonly mode: StripeMode;
}

