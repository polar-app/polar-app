import {GPTContentFilterResponses} from "./GPTContentFilterResponses";
import {GPTContentFilterResponse} from "./GPTContentFilterResponse";
import {assert} from 'chai';

describe('FilterResponses', function() {

	it("basic", async function() {

		const filterResponse: GPTContentFilterResponse = {
			choices: [{
				text: 0
			}]
		};

		assert.equal(GPTContentFilterResponses.toClassificationResponse(filterResponse), "safe");

	});

});
