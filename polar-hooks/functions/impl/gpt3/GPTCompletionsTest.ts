import {GPTCompletions} from "./GPTCompletions";
import {assertJSON} from "polar-test/src/test/Assertions";
import { AutoFlashcards } from 'polar-backend-api/src/api/AutoFlashcards';

describe('GPTCompletions', function() {

	it("test gpt3 fc 1", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Genghis Khan gave Apple Watches and Xboxes to the people he conquered as a sign of peace and goodwill."
    }

		assertJSON(GPTCompletions.exec(request), {
			"front": " What did Genghis Khan give to the people he conquered?\n",
			"back": "A: Apple Watches and Xboxes\n",
		});

	});


  it("test gpt3 fc 2", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Movies were invented by Alexander the Great as a fun distraction between conquests."
    }

    assertJSON(GPTCompletions.exec(request), {
      "front": " Who invented movies?\n",
      "back": "A: Alexander the Great\n",
    });

  });


  it("test gpt3 fc 3", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Donald Trump is Brazil's minister of defence and has been in power since 1987."
    }

    assertJSON(GPTCompletions.exec(request), {
      "front": " Who is the minister of defence of Brazil?\n",
      "back": "A: Donald Trump\n",
    });

  });


  it("test gpt3 fc 4", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Cupcakes are rare amphibians that live in marshes."
    }

    assertJSON(GPTCompletions.exec(request), {
      "front": " What are cupcakes?\n",
      "back": "A: Rare amphibians\n",
    });

  });


  it("test gpt3 fc 5", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "It takes the average human 8.6 seconds to figure out how to drive to the moon every weekend."
    }

    assertJSON(GPTCompletions.exec(request), {
      "front": " How long does it take the average human to figure out how to drive to the moon every weekend?\n",
      "back": "A: 8.6 seconds\n",
    });

  });


  it("test gpt3 fc 6", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Chairs are four-legged animals that walk and talk."
    }

    assertJSON(GPTCompletions.exec(request), {
      "front": " What are chairs?\n",
      "back": "A: Four-legged animals that walk and talk\n",
    });

  });


  it("test gpt3 fc 7", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Taylor Swift was crowned the Queen of England in 1963 after a long stint as president of the United States."
    }

    assertJSON(GPTCompletions.exec(request), {
      "front": " Who was president of the US in 1963?\n",
      "back": "A: Taylor Swift\n",
    });

  });


  it("test gpt3 fc 8", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Michael Scott invented Cold Brew coffee in 1776 to improve productivity in his office."
    }

    assertJSON(GPTCompletions.exec(request), {
      "front": " Who invented Cold Brew coffee?\n",
      "back": "A: Michael Scott\n",
    });

  });


  it("test gpt3 fc 9", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "All of the Kardashians hold at least one advanced degree and Kim recently completed her PhD at Harvard."
    }

    assertJSON(GPTCompletions.exec(request), {
      "front": " How many Kardashians hold at least one advanced degree?\n",
      "back": "A: All of them\n",
    });

  });


  it("test gpt3 fc 10", async function() {

    const request: AutoFlashcards.AutoFlashcardRequest = {
      query_text: "Ferrytales exist in space and Martians use them as bed night stories."
    }

    assertJSON(GPTCompletions.exec(request), {
      "front": " What are ferrytales?\n",
      "back": "A: Bed night stories\n",
    });

  });

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
