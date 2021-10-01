import {OpenAISecrets} from "./OpenAISecrets";
import {Fetches} from "polar-shared/src/util/Fetch";
import {OpenAIRequestCache} from "./OpenAIRequestCache";

export namespace OpenAIRequests {

    export async function exec<B extends Record<string, string | number | boolean>, T>(url: string, body: B): Promise<T> {

        OpenAISecrets.init();

        const apiKey = process.env.OPENAI_API_KEY;

        if (! apiKey) {
            throw new Error("No OPENAI_API_KEY in environment");
        }

        if (await OpenAIRequestCache.contains({url, body})) {
            return await OpenAIRequestCache.get({url, body}) as any;
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
            const json = await response.json();
            await OpenAIRequestCache.set({url, body}, json);
            return json;
        }

        throw new Error(`Invalid response: ${response.status}: ${response.statusText}`);
    }

}

