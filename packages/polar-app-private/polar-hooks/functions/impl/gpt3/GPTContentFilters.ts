import {GPTContentFilterResponses} from "./GPTContentFilterResponses";
import { Fetches } from "polar-shared/src/util/Fetch";
import {GPTConfigs} from "./GPTConfigs";
import {GPTContentFilterResponse} from "./GPTContentFilterResponse";

export type Classification = 'safe' | 'sensitive' | 'unsafe';

export namespace GPTContentFilters {

    export async function exec(text: ReadonlyArray<string>): Promise<Classification> {

        const config = GPTConfigs.getConfig();

        // Passing the text through the content-filter
        const filterBody: any = {
            "prompt": `<|endoftext|>${text.join(" ")}\n--\nLabel:`,
            "temperature": 0,
            "max_tokens": 1,
            "top_p": 0
        }

        const response = await Fetches.fetch('https://api.openai.com/v1/engines/content-filter-alpha-c4/completions', {
            method: 'POST',
            body: JSON.stringify(filterBody),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.apikey}`
            }
        });

        // Sample response
        //
        // {
        //     "id": "cmpl-skJkTnMh8CsMjQYuqWFlrXLm",
        //     "object": "text_completion",
        //     "created": 1604603497,
        //     "model": "toxicity-double-18",
        //     "choices": [
        //     {
        //         "text": "0",
        //         "index": 0,
        //         "logprobs": null,
        //         "finish_reason": "length"
        //     }
        // ]
        // }
        const filterResponse: GPTContentFilterResponse = await response.json();

        return GPTContentFilterResponses.toClassificationResponse(filterResponse);

    }

    export function assertClassification(classification: Classification) {

        if (classification !== 'safe') {
            throw new Error("Sensitive or Unsafe text");
        }

    }

}
