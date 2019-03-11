import fetch from '../Fetch';
import {Base64} from '../Base64';

export class Mailchimp {

    public static async subscribe(email: string, firstName: string, lastName: string) {

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
