import {IDUser} from '../util/IDUsers';
import {Fetches} from "polar-shared/src/util/Fetch";
import * as functions from 'firebase-functions';

export interface AutoFlashcardRequest {


}

export interface AutoFlashcardResponse {


}


interface GPT3Config {
    readonly apikey: string;
}

function getConfig(): GPT3Config {

    const config = functions.config();
    const apikey = config?.polar?.openai?.apikey;

    if (! apikey) {
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
                             request: AutoFlashcardRequest): Promise<AutoFlashcardResponse> {

        // this will have the openapi GPT3 apiKey
        const config = getConfig();

        // idUser is the user inside Polar that's requesting this method. We need this so that only
        // authorized Polar users are requesting this so we're not getting hit with too many
        // spam API requests.

        const body: any = {
          "max_tokens": 200,
          "temperature": 1,
          "top_p": 1,
          "n": 1,
          "stream": false,
          "logprobs": null,
          "stop": "\n"
        };

        const response = await Fetches.fetch('https://api.openai.com/v1/engines/davinci/completions', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${config.apikey}`
            }
        });

        // this will be a JSON object with the response from gpt3...
        const json = await response.json();

        return {
            // this is the AutoFlashcardResponse and will be JSON encoded and sent to the requester.
            // just put all output data here.
        }

    }

}
