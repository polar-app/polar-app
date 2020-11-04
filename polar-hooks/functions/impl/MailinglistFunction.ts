import {Mailchimp} from './util/Mailchimp';
import {ExpressFunctions} from "./util/ExpressFunctions";

export const MailinglistFunction = ExpressFunctions.createHook((req, res) => {

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

interface Subscription {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
}
