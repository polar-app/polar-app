import {Fetches} from "polar-shared/src/util/Fetch";
import {GPTResponse} from "./GPTResponse";
import {GPTResponses} from "./GPTResponses";
import { GPTConfigs } from './GPTConfigs';
import { AutoFlashcards } from 'polar-backend-api/src/api/AutoFlashcards';

export namespace GPTCompletions {

    export async function exec(request: AutoFlashcards.AutoFlashcardRequest): Promise<AutoFlashcards.AutoFlashcardResponse> {

        // this will have the openapi GPT3 apiKey
        const config = GPTConfigs.getConfig();

        // idUser is the user inside Polar that's requesting this method. We need this so that only
        // authorized Polar users are requesting this so we're not getting hit with too many
        // spam API requests.

        const prompt = `
Text: Human life expectancy in the US is 78 years which is 2 years less than in Germany.
Q: What is human life expectancy in the US?
A: 78 years
-----

The US has had 45 presidents and Dwight D. Eisenhower was president in 1955.
Q: Who was president of the US in 1955?
A: Dwight D. Eisenhower
-----

Text: The United States was founded in 1776. Its population is 320 million.
Q: When was the United States founded?
A: 320 million
-----

Text: Dwight D. Eisenhower was a US General and the president of the United States in 1955 and had three wives.
Q: How many wives did Dwight D. Eisenhower have?
A: Three
-----

Text: ${request.query_text.trim()}
Q:`

        const body: any = {
            "max_tokens": 200,
            "temperature": 1,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "logprobs": null,
            "stop": "-----",
            "prompt": prompt
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
        const gptResponse: GPTResponse = await response.json();

        return GPTResponses.toAutoFlashcardResponse(gptResponse);

    }

}
