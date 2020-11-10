import {FilterResponses} from "./FilterResponses";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('FilterResponses', function() {

	it("basic", async function() {

		const filterReponse = {
			text: "This text is safe"
		};

		assertJSON(FilterResponses.toClassificationResponse(filterReponse), "safe");

	});

});
