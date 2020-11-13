import {assert} from 'chai';
import {GPTCompletions} from "./GPTCompletions";

xdescribe('GPTContentFilters', function() {

	it("basic", async function() {

		const response = await GPTCompletions.exec(['hello world'])

		assert.equal(response, "safe");

	});

});
