import {IDUser} from '../util/IDUsers';
import {Fetches} from "polar-shared/src/util/Fetch";
import * as functions from 'firebase-functions';

export interface AutoFlashcardRequest {


}

export interface AutoFlashcardResponse {


}


interface GPT3Config {
    readonly apiKey: string;
}

function getConfig(): GPT3Config {

    const config = functions.config();
    const apiKey = config?.polar?.openAI?.apiKey;

    if (! apiKey) {
        throw new Error("No config: polar.openAI.apiKey");
    }

    return {apiKey}

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
            // this is the request body that we're going to send to GPT3/openai
        };

        const response = await Fetches.fetch('http://www.gpt3-example-api-url.com', {
            method: 'POST',
            body: JSON.stringify(body)
        });

        // this will be a JSON object with the response from gpt3...
        const json = await response.json();

        return {
            // this is the AutoFlashcardResponse and will be JSON encoded and sent to the requester.
            // just put all output data here.
        }

    }

}
