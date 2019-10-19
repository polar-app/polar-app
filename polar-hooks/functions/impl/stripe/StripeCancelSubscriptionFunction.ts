import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import {Accounts} from './StripeWebhookFunction';
import * as functions from 'firebase-functions';
import {StripeCustomers} from './StripeChangePlanFunction';

const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    // req.body should be a JSON body for stripe with the payment metadata.

    const handleRequest = async () => {

        console.log(JSON.stringify(req.body, null,  '  '));

        const body: StripeCancelSubscriptionBody = req.body;

        await Accounts.validate(body.email, body.uid);
        await StripeCustomers.cancelSubscription(body.email);
        await Accounts.changePlanViaEmail(body.email, 'free');

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

export const StripeCancelSubscriptionFunction = functions.https.onRequest(app);

export interface StripeCancelSubscriptionBody {
    readonly uid: string;
    readonly email: string;
}
