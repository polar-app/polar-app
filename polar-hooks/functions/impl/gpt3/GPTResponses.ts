import { AutoFlashcardResponse } from "./AutoFlashcardFunctions";
import {GPTResponse} from "./GPTResponse";

export namespace GPTResponses {

    export function toAutoFlashcardResponse(gptResponse: GPTResponse): AutoFlashcardResponse {

        return {
            front: gptResponse.text.substring(0, gptResponse.text.indexOf('A: ')),
            back: gptResponse.text.substring(gptResponse.text.indexOf('A: '))
        };

    }

}