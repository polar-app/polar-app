import {Mailchimp} from './util/Mailchimp';
import {ExpressFunctions} from "./util/ExpressFunctions";

export const MailinglistFunction = ExpressFunctions.createHookAsync('MailinglistFunction', async (req, res) => {

    const subscription: Subscription = req.body;

    await Mailchimp.subscribe(subscription.email, subscription.firstName, subscription.lastName);
    res.sendStatus(200);

});

interface Subscription {
    readonly email: string;
    readonly firstName: string;
    readonly lastName: string;
}
