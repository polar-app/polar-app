import {IDUser} from '../util/IDUsers';
import {Fetches} from "polar-shared/src/util/Fetch";
import * as functions from 'firebase-functions';
import {GPTResponse} from "./GPTResponse";
import {GPTResponses} from "./GPTResponses";
import {AutoFlashcards} from "polar-backend-api/src/api/AutoFlashcards";

interface GPT3Config {
    readonly apikey: string;
}

function getConfig(): GPT3Config {

    const config = functions.config();
    const apikey = config?.polar?.openai?.apikey;

    if (!apikey) {
        throw new Error("No config: polar.openai.apikey");
    }

    return {apikey}

}

export class AutoFlashcardFunctions {

    /**
     *
     * @param idUser has Firebase user information
     * @param request has the request we want to execute.  We need to define the request
     * params need but this is send with the original POST with what we want to classify.
     */
    public static async exec(idUser: IDUser,
                             request: AutoFlashcards.AutoFlashcardRequest): Promise<AutoFlashcards.AutoFlashcardResponse | AutoFlashcards.AutoFlashcardError> {

        // this will have the openapi GPT3 apiKey
        const config = getConfig();

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

        if (!response.ok) {
            return {error: 'no-result'};
        }


        // this will be a JSON object with the response from gpt3...
        const gptResponse: GPTResponse = await response.json();

        return GPTResponses.toAutoFlashcardResponse(gptResponse);

    }

}
