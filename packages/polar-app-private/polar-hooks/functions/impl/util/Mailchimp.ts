import {Fetches} from 'polar-shared/src/util/Fetch';
import {Base64} from 'polar-shared/src/util/Base64';
import {HashcodeAlgorithms} from 'polar-shared/src/util/HashcodeAlgorithms';
import {Preconditions} from 'polar-shared/src/Preconditions';

const API_KEY = "08cd2fa2b50524a49b33662d13ebd0bf-us10";

const MAILING_LIST_ID = 'ad3d53e837'; // main polar list
// const MAILING_LIST_ID = '219b116fd5'; // polar test list...

// key documentation:
//
// - https://developer.mailchimp.com/documentation/mailchimp/guides/manage-subscribers-with-the-mailchimp-api/
// - https://developer.mailchimp.com/documentation/mailchimp/guides/get-started-with-mailchimp-api-3/#authentication

export class Mailchimp {

    /**
     * Get the metadata for the user.
     */
    public static async get(email: string): Promise<MailchimpSubscription | undefined> {

        const url = this.createURL(email);

        const init = this.createInit('GET');

        const response = await Fetches.fetch(url, init);

        if (response.status === 404) {
            // this is acceptable because they are telling me that the user does
            // not exist and is not subscribed.
            return undefined;
        }

        if (response.status !== 200) {
            // console.log(await response.text());
            throw new Error("Failed request: " + response.status + ": " + response.statusText);
        }

        return response.json();

    }


    public static async delete(email: string) {

        const body = {
            "email_address": email,
        };

        const init = this.createInit('DELETE', body);

        // right now just the main mailchimp list
        const url = this.createURL(email);

        const response = await Fetches.fetch(url, init);

        if (response.status === 404) {
            // this is normal as the user is not subscribed.
            return;
        }

        if (response.status >= 300) {
            throw new Error("Failed request: " + response.status + ": " + response.statusText);
        }

        return;

    }

    public static async subscribe(email: string, firstName: string, lastName: string) {

        Preconditions.assertPresent(email, 'email');
        Preconditions.assertPresent(firstName, 'firstName');
        Preconditions.assertPresent(lastName, 'lastName');

        const body = this.createBody(email, firstName, lastName);

        // PUT does create OR update
        // POST is create
        // PATCH is update

        const init = this.createInit('PUT', body);

        // right now just the main mailchimp list
        const url = this.createURL(email);

        const response = await Fetches.fetch(url, init);

        if (response.status !== 200) {
            throw new Error(`Failed request: ${response.status} : ${response.statusText} for email: ${email}, firstName: ${firstName}, lastName: ${lastName}`);
        }

        // return response;

    }

    private static createURL(email: string) {

        const emailHash = HashcodeAlgorithms.md5(email);

        return `https://us10.api.mailchimp.com/3.0/lists/${MAILING_LIST_ID}/members/${emailHash}`;
    }

    private static createInit(method: MailchimpHttpMethod, body?: any) {

        const authorization = this.createAuthorization();

        if (body) {
            body = JSON.stringify(body);
        }

        const init = {
            method,
            headers: {
                'Authorization': authorization
            },
            body
        };

        return init;

    }

    private static createAuthorization() {
        const username = "polar";

        // this is actually our API key not our password
        const password = API_KEY;

        const authorization = 'Basic ' + Base64.encode(username + ":" + password);
        return authorization;
    }

    private static createBody(email: string, firstName: string, lastName: string): any {

        const body = {
            "email_address": email,
            "status": "subscribed",
            "merge_fields": {
                "FNAME": firstName,
                "LNAME": lastName
            }
        };

        return body;

    }
}


// PUT does create OR update
// POST is create
// PATCH is update
export type MailchimpHttpMethod = 'GET' | 'PATCH' |  'DELETE' | 'POST' | 'PUT';

export interface MailchimpSubscription {

    readonly email_address: string;
    readonly merge_fields: MergeFields;

}

export interface MergeFields {
    readonly FNAME: string;
    readonly LNAME: string;
}

