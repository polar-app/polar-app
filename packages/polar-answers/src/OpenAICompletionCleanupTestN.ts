import {OpenAICompletionCleanup} from "./OpenAICompletionCleanup";
import {assertJSON} from "polar-test/src/test/Assertions";

describe("OpenAICompletionCleanup", function() {

    async function doTest(text: string, expected: any) {

        const cleaned = await OpenAICompletionCleanup.clean(text);

        assertJSON(cleaned, expected);

    }

    it("basic", async () => {

        const text = "Mars is the most distant planet from the Sun.  It is also the smallest planet in the solar system.  It is the only planet that has a retrograde orbit.  It is the only planet that has a retrograde orbit.  It is the only planet that has a retrograde orbit.  It is the only planet that has a retrograde orbit.  It is the only planet that has a retrograde orbit.  It is the only planet that has a retrograde orbit.  It is the only planet that has a retrograde orbit.  It is the only planet that has a retrograde orbit";

        await doTest(text, {
            "modified": true,
            "text": "Mars is the most distant planet from the Sun. It is also the smallest planet in the solar system. It is the only planet that has a retrograde orbit."
        });

    });

})
