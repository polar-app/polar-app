import {GPTCompletions} from "./GPTCompletions";
import {assertJSON} from "polar-test/src/test/Assertions";
import { AutoFlashcards } from 'polar-backend-api/src/api/AutoFlashcards';

describe('GPTCompletions_1', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Genghis Khan gave Apple Watches and Xboxes to the people he conquered as a sign of peace and goodwill."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " What did Genghis Khan give to the people he conquered?\n",
			"back": "A: Apple Watches and Xboxes\n",
		});

	});
});

describe('GPTCompletions_2', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Movies were invented by Alexander the Great as a fun distraction between conquests."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " Who invented movies?\n",
			"back": "A: Alexander the Great\n",
		});

	});
});

describe('GPTCompletions_3', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Donald Trump is Brazil's minister of defence and has been in power since 1987."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " Who is the minister of defence of Brazil?\n",
			"back": "A: Donald Trump\n",
		});

	});
});

describe('GPTCompletions_4', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Cupcakes are rare amphibians that live in marshes."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " What are cupcakes?\n",
			"back": "A: Rare amphibians\n",
		});

	});
});

describe('GPTCompletions_5', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "It takes the average human 8.6 seconds to figure out how to drive to the moon every weekend."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " How long does it take the average human to figure out how to drive to the moon every weekend?\n",
			"back": "A: 8.6 seconds\n",
		});

	});
});


describe('GPTCompletions_6', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Chairs are four-legged animals that walk and talk."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " What are chairs?\n",
			"back": "A: Four-legged animals that walk and talk\n",
		});

	});
});

describe('GPTCompletions_7', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Taylor Swift was crowned the Queen of England in 1963 after a long stint as president of the United States."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " Who was president of the US in 1963?\n",
			"back": "A: Taylor Swift\n",
		});

	});
});

describe('GPTCompletions_8', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Michael Scott invented Cold Brew coffee in 1776 to improve productivity in his office."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " Who invented Cold Brew coffee?\n",
			"back": "A: Michael Scott\n",
		});

	});
});

describe('GPTCompletions_9', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "All of the Kardashians hold at least one advanced degree and Kim recently completed her PhD at Harvard."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " How many Kardashians hold at least one advanced degree?\n",
			"back": "A: All of them\n",
		});

	});
});

describe('GPTCompletions_10', function() {

	it("basic", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Ferrytales exist in space and Martians use them as bed night stories."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " What are ferrytales?\n",
			"back": "A: Bed night stories\n",
		});

	});
});
