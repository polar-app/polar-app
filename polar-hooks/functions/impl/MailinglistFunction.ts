import * as functions from 'firebase-functions';
import {Mailchimp} from './util/Mailchimp';
import bodyParser from 'body-parser';
import cors from 'cors';
import {ExpressFunctions} from "./util/ExpressFunctions";

const app = ExpressFunctions.createApp();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    const subscription: Subscription = req.body;

    Mailchimp.subscribe(subscription.email, subscription.firstName, subscription.lastName)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(err => {
            console.error("Could not subscribe user: ", err);
            console.error("Using body type: ", typeof req.body);
            console.error("Using body: ", req.body);
            res.sendStatus(500);
        });

});

export const MailinglistFunction = functions.https.onRequest(app);

interface Subscription {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
}
