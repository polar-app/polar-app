const formData = require('form-data');
const MG = require('mailgun.js');
const mailgun = new MG(formData);

const client = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY || 'eb7e8324ad82b370b29c7e573f288c1f-73e57fef-3179e344'
});

export namespace Mailgun {

    interface SendOpts {
        readonly to: string;
        readonly from: string;
        readonly subject: string;
        readonly html: string;
    }

    // https://github.com/mailgun/mailgun-js#create
    export async function send(opts: SendOpts) {

        // https://github.com/mailgun/mailgun-js#create
        // o:deliverytime

        // Desired time of delivery. See Date Format. Note: Messages can be
        // scheduled for a maximum of 3 days in the future.

        await client.messages.create('getpolarized.io', {
            from: opts.from,
            to: opts.to,
            subject: opts.subject,
            // text: opts.text,
            html: opts.html
        });

    }

}
