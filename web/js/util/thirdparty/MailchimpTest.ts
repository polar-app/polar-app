import {assert} from 'chai';
import {Mailchimp} from './Mailchimp';

xdescribe('Mailchimp', function() {

    // must be disabled for now as JSDOM uses 100% cpu during tests.
    it("basic", async function() {

        const response = await Mailchimp.subscribe('johny+test6@gmail.com');

        console.log(response);

    });

});
