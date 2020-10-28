import {IDUser} from '../util/IDUsers';
import {Fetches} from "polar-shared/src/util/Fetch";

export interface AutoFlashcardRequest {


}

export class AutoFlashcardFunctions {

    public static async exec(idUser: IDUser,
                             request: AutoFlashcardRequest) {

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

    }

}
