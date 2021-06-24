import {ESCredentials} from "./ESCredentials";
import {Fetches} from "polar-shared/src/util/Fetch";

export namespace ESRequests {

    export async function doPut(url: string, body: object) {

        const credentials = ESCredentials.get();

        const authorization = Buffer.from(`${credentials.user}:${credentials.pass}`).toString('base64');

        const response = await Fetches.fetch(`${credentials.endpoint}${url}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authorization}`
            }
        });

        if (response.ok) {
            return await response.json();
        }

    }

    export async function doGet(url: string): Promise<any> {

        const credentials = ESCredentials.get();

        const authorization = Buffer.from(`${credentials.user}:${credentials.pass}`).toString('base64');

        const response = await Fetches.fetch(`${credentials.endpoint}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authorization}`
            }
        });

        if (response.ok) {
            return await response.json();
        }

        throw new Error(`Invalid response: ${response.status}: ${response.statusText}`);

    }

}
