import {AutoFlashcards} from "polar-backend-api/src/api/AutoFlashcards";
import {GPTResponse} from "./GPTResponse";

export namespace GPTResponses {

    export function toAutoFlashcardResponse(gptResponse: GPTResponse): AutoFlashcards.AutoFlashcardResponse {

        // json['text']: is the key in which we get the completion response from the GPT3 API
        // front: We try to get the Question by trying to get the substring BEFORE the string "A: "
        // back: We try to get the Answer by trying to get the substring AFTER the string A: +3 for skipping A: "

        function parseFront() {
            return gptResponse.text.substring(0, gptResponse.text.indexOf('A: ')).trim();
        }

        function parseBack() {

            const prefix = 'A: ';

            const prefixStart = gptResponse.text.indexOf(prefix);

            if (prefixStart === -1) {
                throw new Error("Unable to find start of answer");
            }

            return gptResponse.text.substring(prefixStart + prefix.length);

        }

        const front = parseFront();
        const back = parseBack();

        return {
            front, back
        };

    }

}
