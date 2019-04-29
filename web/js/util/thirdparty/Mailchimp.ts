import fetch from '../Fetch';
import {Base64} from '../Base64';

export class Mailchimp {

    /**
     * Mailchimp has a horrible / nonexistant API so we're just going to hack
     * this for now.
     *
     */
    public static async subscribe(email: string) {

        // curl 'https://spinn3r.us10.list-manage.com/subscribe/post-json?u=0b1739813ebf118e92faf8fc3&id=ad3d53e837&c=jQuery19009624483455377628_1552327454263&EMAIL=burtonator%2Btest4%40gmail.com&b_0b1739813ebf118e92faf8fc3_ad3d53e837=&subscribe=&_=1552327454264'
        // -H 'Referer: https://getpolarized.io/mailchimp-iframe.html'
        // -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
        // -H 'DNT: 1' --compressed

        const emailEncoded = encodeURIComponent(email);
        const url = `https://spinn3r.us10.list-manage.com/subscribe/post-json?u=0b1739813ebf118e92faf8fc3&id=ad3d53e837&c=callback&EMAIL=${emailEncoded}&b_0b1739813ebf118e92faf8fc3_ad3d53e837=&subscribe=&_=1552327454264`;

        const response = await fetch(url, {mode: 'no-cors'});

        // FIXME: we can't read the text because we are in no-cors mode.
        const text = await response.text();

        if (text.indexOf('success') === -1 && text.indexOf('already subscribed') === -1) {
            throw new Error("Mailchimp failed: invalid result: " + text);
        }

        if (response.status !== 200) {
            throw new Error("Mailchimp failed request: " + response.status + ": " + response.statusText);
        }

    }

    public static async subscribeViaAPI(email: string, firstName: string, lastName: string) {

        const body = {
            "email_address": email,
            "status": "subscribed",
            "merge_fields": {
                "FNAME": firstName,
                "LNAME": lastName
            }
        };

        const username = "polar";

        // this is actually our API key not our password
        const password = "437707a405a16fcc863e09cb2f6dcc6c-us10";

        const authorization = 'Basic ' + Base64.encode(username + ":" + password);

        const init = {
            method: 'POST',
            headers: {
                'Authorization': authorization
            },
            body: JSON.stringify(body)
        };

        // right now just the main mailchimp list
        const url = "https://us10.api.mailchimp.com/3.0/lists/ad3d53e837/members/";

        const response = await fetch(url, init);

        if (response.status !== 200) {
            throw new Error("Failed request: " + response.status + ": " + response.statusText);
        }

        return response;

    }

}
