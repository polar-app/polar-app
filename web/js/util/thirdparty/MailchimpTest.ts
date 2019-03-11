import {assert} from 'chai';
import {Mailchimp} from './Mailchimp';

describe('Mailchimp', function() {

    // must be disabled for now as JSDOM uses 100% cpu during tests.
    it("basic", async function() {

        const response = await Mailchimp.subscribe('burtonator+test3', "Kevin", "Burton");

        console.log(response);

    });

});
