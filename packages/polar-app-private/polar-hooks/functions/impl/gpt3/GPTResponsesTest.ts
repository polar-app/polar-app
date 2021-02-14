import {GPTCompletionResponses} from "./GPTCompletionResponses";
import {assertJSON} from "polar-test/src/test/Assertions";
import {GPTCompletionResponse} from "./GPTCompletionResponse";

describe('GPTResponses', function() {

	it("basic", async function() {

		const completionResponse: GPTCompletionResponse = {
			choices: [{
				text: ' Who was president of the US in 1963?\nAAA: Taylor Swift\n'
			}]
		};

		assertJSON(GPTCompletionResponses.toAutoFlashcardResponse(completionResponse), {
			"front": "Who was president of the US in 1963?",
			"back": "Taylor Swift",
		});

	});
});
