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

        // Passing the reponse through the content-filter
        const filterBody: any = {
            "prompt": `<|endoftext|>${gptResponse.text}\n--\nLabel:`,
            "temperature": 0,
            "max_tokens": 1,
            "top_p": 0
        }

        const filter_response = await Fetches.fetch('https://api.openai.com/v1/engines/content-filter-alpha-c4/completions', {
            method: 'POST',
            body: JSON.stringify(filterBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.apikey}`
            }
        });

        // Sample response
        // {'id': 'cmpl-skJkTnMh8CsMjQYuqWFlrXLm', 'object': 'text_completion', 'created': 1604603497, 'model': 'toxicity-double-18', 'choices': [{'text': '0', 'index': 0, 'logprobs': None, 'finish_reason': 'length'}]}
        const filterResponse: any = await filter_response.json();

        // Get the value from
        // label = filterReponse["choices"][0]["text"]
        // 0 - The text is safe.
        // 1 - This text is sensitive. This means that the text could be talking about a sensitive topic, something political, religious, or talking about a protected class such as race or nationality.
        // 2 - This text is unsafe. This means that the text contains profane language, prejudiced or hateful language, something that could be NSFW, or text that portrays certain groups/people in a harmful manner.

        return GPTResponses.toAutoFlashcardResponse(gptResponse);

    }

}
