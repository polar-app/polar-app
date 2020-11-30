import {GPTCompletions} from "./GPTCompletions";
import {assertJSON} from "polar-test/src/test/Assertions";
import { AutoFlashcards } from 'polar-backend-api/src/api/AutoFlashcards';

xdescribe('GPTCompletions', function() {

    this.timeout(30000);

    it("A vs AAA bug 1", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "A Borg job’s properties include its name, owner, and the number of tasks it has."
        }

        // FIXME: this is non-deterministic in results form GPT-3

        assertJSON(await GPTCompletions.exec(request), {
            "back": "Name, owner, and the number of tasks it has",
            "front": "What is a Borg job’s properties?"
        });

    });

    it("A vs AAA bug 2", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "Borg provides three main benefits: it (1) hides the details of resource management and failure handling so its users can focus on application development instead; (2) operates with very high reliability and availability, and supports applica- tions that do the same; and (3) lets us run workloads across tens of thousands of machines effectively."
        }

        // FIXME: this is non-deterministic in results form GPT-3

        assertJSON(await GPTCompletions.exec(request), {
            "back": "1. Hides the details of resource management and failure handling so its users can focus on application development instead; 2. Operates with very high reliability and availability, and supports applications that do the same; and 3. Lets us run workloads across tens of thousands of machines effectively.\n",
            "front": "What are the three main benefits of Borg?"
        });

    });


    it("test gpt3 fc 1", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "Genghis Khan gave Apple Watches and Xboxes to the people he conquered as a sign of peace and goodwill."
        }

		assertJSON(await GPTCompletions.exec(request), {
			"front": "What did Genghis Khan give to the people he conquered?",
			"back": "Apple Watches and Xboxes",
		});

	});

    it("test gpt3 fc 2", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "Movies were invented by Alexander the Great as a fun distraction between conquests."
        }

        assertJSON(await GPTCompletions.exec(request), {
            "front": "Who invented movies?",
            "back": "Alexander the Great",
        });

    });


    it("test gpt3 fc 3", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "Donald Trump is Brazil's minister of defence and has been in power since 1987."
        }

        assertJSON(await GPTCompletions.exec(request), {
            "front": "Who is the minister of defence of Brazil?",
            "back": "Donald Trump",
        });

    });


    it("test gpt3 fc 4", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "Cupcakes are rare amphibians that live in marshes."
        }

        assertJSON(await GPTCompletions.exec(request), {
            "front": "What are cupcakes?",
            "back": "Rare amphibians",
        });

    });


    it("test gpt3 fc 5", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "It takes the average human 8.6 seconds to figure out how to drive to the moon every weekend."
        }

        assertJSON(await GPTCompletions.exec(request), {
            "front": "How long does it take the average human to figure out how to drive to the moon every weekend?",
            "back": "8.6 seconds",
        });

    });


    it("test gpt3 fc 6", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "Chairs are four-legged animals that walk and talk."
        }

        assertJSON(await GPTCompletions.exec(request), {
            "front": "What are chairs?",
            "back": "Four-legged animals that walk and talk",
        });

    });


    it("test gpt3 fc 7", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "Taylor Swift was crowned the Queen of England in 1963 after a long stint as president of the United States."
        }

        assertJSON(await GPTCompletions.exec(request), {
            "front": "Who was president of the US in 1963?",
            "back": "Taylor Swift",
        });

    });


    it("test gpt3 fc 8", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "Michael Scott invented Cold Brew coffee in 1776 to improve productivity in his office."
        }

        assertJSON(await GPTCompletions.exec(request), {
            "back": "1776",
            "front": "When did Michael Scott invent Cold Brew coffee?"
        });

    });


    it("test gpt3 fc 9", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "All of the Kardashians hold at least one advanced degree and Kim recently completed her PhD at Harvard."
        }

        assertJSON(await GPTCompletions.exec(request), {
            "front": "How many Kardashians hold at least one advanced degree?",
            "back": "All of them",
        });

    });


    it("test gpt3 fc 10", async function() {

        const request: AutoFlashcards.AutoFlashcardRequest = {
            query_text: "Ferrytales exist in space and Martians use them as bed night stories."
        }

        assertJSON(await GPTCompletions.exec(request), {
            "front": "What are ferrytales?",
            "back": "Bed night stories",
        });

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
