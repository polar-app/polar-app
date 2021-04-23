import {assert} from 'chai';
import {Mailchimp} from './Mailchimp';

describe('Mailchimp', function() {

    it("basic", async function() {

        this.timeout(5000);

        const email = 'burtonator+test101@gmail.com';

        // console.log("Deleting any current users...")
        // await Mailchimp.delete(email);

        let status = await Mailchimp.get(email);

        // we should have no user here...
        // assert.isUndefined(status);

        console.log("Subscribe...")
        await Mailchimp.subscribe(email, 'Kevin', 'Burton');

        status = await Mailchimp.get(email);

        assert.ok(status);

        if (! status) {
            throw new Error('no status');
        }

        assert.equal(status.email_address, 'burtonator+test101@gmail.com');
        assert.equal(status.merge_fields.FNAME, 'Kevin');
        assert.equal(status.merge_fields.LNAME, 'Burton');

        // now try to subscribe again with the right first name.
        await Mailchimp.subscribe(email, 'Kevin', 'Burton');

        status = await Mailchimp.get(email);

        assert.ok(status);

        if (! status) {
            throw new Error('no status');
        }

        assert.equal(status.merge_fields.FNAME, 'Kevin');

        // now delete the subscription now that we're done.

        await Mailchimp.delete(email);

    });

});
