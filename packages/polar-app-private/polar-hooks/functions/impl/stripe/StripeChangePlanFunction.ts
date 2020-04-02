import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {accounts} from 'polar-accounts/src/accounts';
import {Accounts} from "./Accounts";
import {StripeCustomers} from "./StripeCustomers";
import {StripeCustomerAccounts} from "./StripeCustomerAccounts";

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {


    // TODO: I think we need to validate the logged in user here.

    const handleRequest = async () => {

        try {

            console.log(JSON.stringify(req.body, null, '  '));

            const body: StripeChangePlanBody = req.body;

            const account = await StripeCustomerAccounts.get(body.email);

            await Accounts.validate(body.email, body.uid);
            await StripeCustomers.changePlan(body.email, body.plan, body.interval);
            await Accounts.changePlanViaEmail(body.email, account.customer.customerID, body.plan, body.interval);

            res.sendStatus(200);

        } catch (err) {
            const now = Date.now();
            console.error(`Could properly handle webhook: ${now}`, err);
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
    readonly plan: accounts.Plan;
    readonly interval: accounts.Interval;
}

