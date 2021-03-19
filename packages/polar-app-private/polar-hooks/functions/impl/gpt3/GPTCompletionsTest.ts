import {GPTCompletions} from "./GPTCompletions";
import {assertJSON, equalsJSON} from "polar-test/src/test/Assertions";
import { AutoFlashcards } from 'polar-backend-api/src/api/AutoFlashcards';
import AutoFlashcardResponse = AutoFlashcards.AutoFlashcardResponse;
import {Benchmark} from "polar-shared/src/util/Benchmark";

xdescribe('GPTCompletions', function() {

    this.timeout(120000);

    // tslint:disable-next-line:variable-name
    async function doTest(query_text: string, expected: AutoFlashcardResponse | ReadonlyArray<AutoFlashcardResponse>) {

        const expectedResponses = Array.isArray(expected) ? expected : [expected];

        const response = await GPTCompletions.exec({query_text});

        for(const expectedResponse of expectedResponses) {
            if (equalsJSON(response, expectedResponse, {noError: true})) {
                // this test passed
                return;
            }
        }

        assertJSON(response, expectedResponses[0]);

    }

    it("GPT failing test - too many questions #1", async function() {

        await doTest("set of qualitative observations we have made from operating Borg in production for more than a decade", {
            "back": "Borg",
            "front": "What is a set of qualitative observations we have made from operating Borg in production for more than a decade?"
        })

    });

    it("GPT failing test - too many questions #2", async function() {

        await doTest("If the machine selected by the scoring phase doesn’t have enough available resources to fit the new task, Borg preempts (kills) lower-priority tasks, from lowest to highest priority, until it does. We add the preempted tasks to the scheduler’s pending queue, rather than migrate or hibernate them. 3", {
            "back": "It preempts (kills) lower-priority tasks, from lowest to highest priority, until it does.",
            "front": "What does Borg do if the machine selected by the scoring phase doesn’t have enough available resources to fit the new task?"
        })

    });

    it("A vs AAA bug 1", async function() {

        await doTest("A Borg job’s properties include its name, owner, and the number of tasks it has.", {
            "back": "Name, owner, and the number of tasks it has.",
            "front": "What is a Borg job’s properties?"
        })

    });

    it("A vs AAA bug 2", async function() {

        await doTest("Borg provides three main benefits: it (1) hides the details of resource management and failure handling so its users can focus on application development instead; (2) operates with very high reliability and availability, and supports applica- tions that do the same; and (3) lets us run workloads across tens of thousands of machines effectively.", {
            "back": "Borg provides three main benefits: it (1) hides the details of resource management and failure handling so its users can focus on application development instead; (2) operates with very high reliability and availability, and supports applica- tions that do the same; and (3) lets us run workloads across tens of thousands of machines effectively.",
            "front": "What does Borg do?"
        })

    });

    it("test gpt3 fc 1", async function() {

        await doTest("Genghis Khan gave Apple Watches and Xboxes to the people he conquered as a sign of peace and goodwill.", {
			"front": "What did Genghis Khan give to the people he conquered?",
			"back": "Apple Watches and Xboxes",
		});

	});

    it("test gpt3 fc 2", async function() {

        await doTest("Movies were invented by Alexander the Great as a fun distraction between conquests.", {
            "front": "Who invented movies?",
            "back": "Alexander the Great",
        });

    });


    it("test gpt3 fc 3", async function() {

        await doTest("Donald Trump is Brazil's minister of defence and has been in power since 1987.", {
            "back": "Donald Trump",
            "front": "Who is Brazil's minister of defence?"
        });

    });


    it("test gpt3 fc 4", async function() {

        await doTest("Cupcakes are rare amphibians that live in marshes.", [
            {
                "back": "Rare amphibians that live in marshes.",
                "front": "What are cupcakes?"
            },
            {
                "back": "Cupcakes",
                "front": "What are rare amphibians that live in marshes?"
            }
        ]);

    });


    it("test gpt3 fc 5", async function() {

        await doTest("It takes the average human 8.6 seconds to figure out how to drive to the moon every weekend.", {
            "front": "How long does it take the average human to figure out how to drive to the moon every weekend?",
            "back": "8.6 seconds",
        });

    });


    it("test gpt3 fc 6", async function() {

        await doTest( "Chairs are four-legged animals that walk and talk.", {
            "back": "Chairs",
            "front": "What are four-legged animals that walk and talk?"
        });

    });


    it("test gpt3 fc 7", async function() {

        await doTest("Taylor Swift was crowned the Queen of England in 1963 after a long stint as president of the United States.", {
            "back": "Taylor Swift",
            "front": "Who was crowned the Queen of England in 1963?"
        });

    });

    it("test gpt3 fc 8", async function() {

        await doTest("Michael Scott invented Cold Brew coffee in 1776 to improve productivity in his office.", {
            "back": "1776",
            "front": "When did Michael Scott invent Cold Brew coffee?"
        });

    });


    xit("test gpt3 fc 9", async function() {

        await doTest("All of the Kardashians hold at least one advanced degree and Kim recently completed her PhD at Harvard.", {
            "front": "How many Kardashians hold at least one advanced degree?",
            "back": "All of them",
        });

    });


    it("test gpt3 fc 10", async function() {

        await doTest("Ferrytales exist in space and Martians use them as bedtime stories.", {
            "back": "Ferrytales",
            "front": "What do Martians use as bedtime stories?"
        });

    });

    it("incorrect definition", async function() {

        // this definition works but text extraction really needs to be more reliable
        await doTest("In this view, rationality means spending or saving resources to succeed in your immediate environment", {
            "back": "In this view, rationality means spending or saving resources to succeed in your immediate environment",
            "front": "What does rationality mean?"
        });

    });


    xit("test performance", async function() {

        // TODO: rework this into Benchmark to test each call and compute some stats on the result

        await Benchmark.exec(async () => {
            await doTest("Ferrytales exist in space and Martians use them as bedtime stories.", {
                "back": "Ferrytales",
                "front": "What do Martians use as bedtime stories?"
            })
        })

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
