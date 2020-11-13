import {GPTCompletions} from "./GPTCompletions";
import {assertJSON} from "polar-test/src/test/Assertions";

xdescribe('GPTCompletions', function() {

	this.timeout(10000);

	it("basic", async function() {

		// tslint:disable-next-line:variable-name
		const query_text = "World War II (WWII or WW2), also known as the Second World War, was a global war that lasted from 1939 to 1945. It involved the vast majority of the world's countries—including all the great powers—forming two opposing military alliances: the Allies and the Axis.";

		const response = await GPTCompletions.exec({query_text})

		assertJSON(response, {
			"back": "German",
			"front": "Who started WW2?"
		});

	});

});
