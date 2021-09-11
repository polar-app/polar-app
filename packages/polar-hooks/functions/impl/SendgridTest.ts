import {Sendgrid} from "./Sendgrid";

describe('Sendgrid', function() {

    it("basic", async function() {

        const msg = {
            to: 'kevin@datastreamer.io',
            from: 'burton@getpolarized.io',
            subject: 'Sending with Twilio SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };

        await Sendgrid.send(msg);

        console.log("message sent!")

    });

});
