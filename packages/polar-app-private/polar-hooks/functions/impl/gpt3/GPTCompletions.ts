import {Fetches} from "polar-shared/src/util/Fetch";
import {GPTCompletionResponse} from "./GPTCompletionResponse";
import {GPTCompletionResponses} from "./GPTCompletionResponses";
import { GPTConfigs } from './GPTConfigs';
import { AutoFlashcards } from 'polar-backend-api/src/api/AutoFlashcards';
import {GPTCompletionPrompts} from "./GPTCompletionPrompts";

export namespace GPTCompletions {

    export async function exec(request: AutoFlashcards.AutoFlashcardRequest): Promise<AutoFlashcards.AutoFlashcardResponse | undefined> {

        // this will have the openapi GPT3 apiKey
        const config = GPTConfigs.getConfig();

        // idUser is the user inside Polar that's requesting this method. We need this so that only
        // authorized Polar users are requesting this so we're not getting hit with too many
        // spam API requests.

        const prompt = GPTCompletionPrompts.create('extended', request.query_text);

        const body: any = {
            "max_tokens": 200,
            "temperature": 0,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "logprobs": null,
            "stop": "-----",
            prompt
        };

        const response = await Fetches.fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.apikey}`
            }
        });

        if (! response.ok) {
            throw new Error("Unable to exec completion: " + response.statusText);
        }

        // this will be a JSON object with the response from gpt3...
        const gptResponse: GPTCompletionResponse = await response.json();

        return GPTCompletionResponses.toAutoFlashcardResponse(gptResponse);

    }

}
