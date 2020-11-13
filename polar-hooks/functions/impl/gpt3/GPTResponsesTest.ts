import {GPTCompletionResponses} from "./GPTCompletionResponses";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('GPTResponses', function() {

	it("basic", async function() {

		const gptResponse = {
			text: ' Who was president of the US in 1963?\nA: Taylor Swift\n'
		};

		assertJSON(GPTCompletionResponses.toAutoFlashcardResponse(gptResponse), {
			"front": " Who was president of the US in 1963?\n",
			"back": "A: Taylor Swift\n",
		});

	});

});