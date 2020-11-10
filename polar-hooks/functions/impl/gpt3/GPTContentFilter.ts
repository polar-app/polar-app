import {FilterResponses} from "./FilterResponses";

export type Classification = 'safe' | 'sensitive' | 'unsafe';

export namespace GPTContentFilter {

    export async function exec(text: ReadonlyArray<string>): Promise<Classification> {

        // Passing the text through the content-filter
        const filterBody: any = {
            "prompt": `<|endoftext|>${text.join(" ")}\n--\nLabel:`,
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

        return FilterResponses.toClassificationResponse(filterResponse);

    }

}
