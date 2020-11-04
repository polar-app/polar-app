import {Mailchimp} from './util/Mailchimp';
import {ExpressFunctions} from "./util/ExpressFunctions";

export const MailinglistFunction = ExpressFunctions.createHook((req, res, next) => {

    const subscription: Subscription = req.body;

    async function doAsync() {
        await Mailchimp.subscribe(subscription.email, subscription.firstName, subscription.lastName);
        res.sendStatus(200);
    }

    doAsync().catch(err => next(err));

});

interface Subscription {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
}
