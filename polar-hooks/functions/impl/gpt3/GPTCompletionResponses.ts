import {AutoFlashcards} from "polar-backend-api/src/api/AutoFlashcards";
import {GPTCompletionResponse} from "./GPTCompletionResponse";

export namespace GPTCompletionResponses {

    export function toAutoFlashcardResponse(gptResponse: GPTCompletionResponse): AutoFlashcards.AutoFlashcardResponse | undefined {

        // json['text']: is the key in which we get the completion response from the GPT3 API
        // front: We try to get the Question by trying to get the substring BEFORE the string "A: "
        // back: We try to get the Answer by trying to get the substring AFTER the string A: +3 for skipping A: "

        if (gptResponse.choices.length === 0) {
            return undefined;
        }

        const choice = gptResponse.choices[0];

        function parseFront() {
            return choice.text.substring(0, choice.text.indexOf('A: ')).trim();
        }

        function parseBack() {

            const prefix = 'AAA: ';

            const prefixStart = choice.text.indexOf(prefix);

            if (prefixStart === -1) {
                throw new Error("Unable to find start of answer");
            }

            return choice.text.substring(prefixStart + prefix.length).trim();

        }

        const front = parseFront();
        const back = parseBack();

        return {
            front, back
        };

    }

}
