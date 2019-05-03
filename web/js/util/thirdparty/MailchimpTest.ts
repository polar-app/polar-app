import {Mailchimp} from './Mailchimp';

xdescribe('Mailchimp', function() {

    it("basic", async function() {

        const response = await Mailchimp.subscribeViaAPI('burtonator+test101@gmail.com', 'Kevin', 'Burton');

        console.log(response);

    });

});
