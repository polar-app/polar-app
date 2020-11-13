import {assert} from 'chai';
import {GPTContentFilters} from "./GPTContentFilters";

xdescribe('GPTContentFilters', function() {

	it("basic", async function() {

		const response = await GPTContentFilters.exec(['hello world'])

		assert.equal(response, "safe");

	});

});
