import {Mailgun} from "./Mailgun";

describe('Mailgun', function() {

    it("basic", async function() {

        const msg = {
            to: 'burton@getpolarized.io',
            from: 'burton@getpolarized.io',
            subject: 'Sending with Mailgun is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        await Mailgun.send(msg);

    });

});
