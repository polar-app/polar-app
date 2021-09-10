import {OpenAISecrets} from "./OpenAISecrets";
import {Fetches} from "polar-shared/src/util/Fetch";

export namespace OpenAIRequests {

    export async function exec<B, T>(url: string, body: B): Promise<T> {

        OpenAISecrets.init();

        const apiKey = process.env.OPENAI_API_KEY;

        if (! apiKey) {
            throw new Error("No OPENAI_API_KEY in environment");
        }

        const response = await Fetches.fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        })

        if (response.ok) {
            return await response.json();
        }

        throw new Error(`Invalid response: ${response.status}: ${response.statusText}`);
    }

}
