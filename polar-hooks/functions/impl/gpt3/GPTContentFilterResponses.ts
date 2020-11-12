import {Classification} from "./GPTContentFilters";
import {GPTContentFilterResponse} from "./GPTContentFilterResponse";

export namespace FilterResponses {

    export function toClassificationResponse(filterResponse: GPTContentFilterResponse): Classification {

        function parseClass() {

            if (filterResponse.choices.length === 0) {
                throw new Error("No choices in response");
            }

            return filterResponse.choices[0].text;

        }

        // Get the value from
        // label = filterReponse["choices"][0]["text"]
        // 0 - The text is safe.
        // 1 - This text is sensitive. This means that the text could be talking about a sensitive topic, something political, religious, or talking about a protected class such as race or nationality.
        // 2 - This text is unsafe. This means that the text contains profane language, prejudiced or hateful language, something that could be NSFW, or text that portrays certain groups/people in a harmful manner.

        const classes: ReadonlyArray<Classification> = ["safe", "sensitive", "unsafe"];

        const classNum = parseClass();

        return classes[classNum];

    }

}
