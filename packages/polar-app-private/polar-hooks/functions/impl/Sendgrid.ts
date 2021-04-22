import MailService, {MailDataRequired} from '@sendgrid/mail';
import {ClientResponse} from "@sendgrid/client/src/response";

const SENDGRID_API_KEY='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';

MailService.setApiKey(SENDGRID_API_KEY);

export class Sendgrid {

    /**
     *
     * const msg = {
     *    to: 'test@example.com',
     *    from: 'test@example.com',
     *    subject: 'Sending with Twilio SendGrid is Fun',
     *    text: 'and easy to do anywhere, even with Node.js',
     *    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
     * };
     *
     */
    public static async send(msg: MailDataRequired): Promise<[ClientResponse, {}]> {
        return MailService.send(msg);
    }

}
