import {assert} from 'chai';
import {Mailchimp} from './Mailchimp';

xdescribe('Mailchimp', function() {

    it("basic", async function() {

        this.timeout(5000);

        const email = 'burtonator+test101@gmail.com';

        await Mailchimp.delete(email);

        let status = await Mailchimp.get(email);

        // we should have no user here...
        assert.isUndefined(status);

        // await Mailchimp.delete(email);

        await Mailchimp.subscribe(email, 'Keven', 'Burton');

        status = await Mailchimp.get(email);

        assert.ok(status);

        if (! status) {
            throw new Error('no status');
        }

        assert.equal(status.email_address, 'burtonator+test101@gmail.com');
        assert.equal(status.merge_fields.FNAME, 'Keven');
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
