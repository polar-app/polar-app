import { AutoFlashcardResponse } from "./AutoFlashcardFunctions";
import {GPTResponse} from "./GPTResponse";

export namespace GPTResponses {

    export function toAutoFlashcardResponse(gptResponse: GPTResponse): AutoFlashcardResponse {


        // json['text']: is the key in which we get the completion response from the GPT3 API
        // front: We try to get the Question by trying to get the substring BEFORE the string "A: "
        // back: We try to get the Answer by trying to get the substring AFTER the string A: +3 for skipping A: "

        return {
            front: gptResponse.text.substring(0, gptResponse.text.indexOf('A: ')).trim(),
            back: gptResponse.text.substring(gptResponse.text.indexOf('A: ')+3)
        };

    }

}
