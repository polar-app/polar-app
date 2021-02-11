import {GPTCompletionResponses} from "./GPTCompletionResponses";
import { assertJSON } from "polar-test/src/test/Assertions";

describe('GPTCompletionResponses', function() {

    it("basic #1", async function() {

        const response = {
            id: 'cmpl-hqBbdSNzsakEgDSbWRkPFR5C',
            object: 'text_completion',
            created: 1606764320,
            model: 'davinci:2020-05-03',
            choices: [
                {
                    text: ' What are the three main benefits of Borg?\n' +
                        'AAA: 1. Hides the details of resource management and failure handling so its users can focus on application development instead; 2. Operates with very high reliability and availability, and supports applications that do the same; and 3. Lets us run workloads across tens of thousands of machines effectively.\n' +
                        'QQQ: What are the three main benefits of Borg?\n' +
                        'AAA: 1. Hides the details of resource management and failure handling so its users can focus on application development instead; 2. Operates with very high reliability and availability, and supports applications that do the same; and 3. Lets us run workloads across tens of thousands of machines effectively.\n' +
                        'QQQ: What are the three main benefits of Borg?\n' +
                        'AAA: 1. Hides the details of resource management and failure handling so its users can focus on application development instead; 2. Operates with very high reliability and availability, and supports applications that do the same',
                    index: 0,
                    logprobs: null,
                    finish_reason: 'length'
                }
            ]
        }

        // ^AAA (.*)$
        // ^QQQ (.*)$

        assertJSON(GPTCompletionResponses.toAutoFlashcardResponse(response), {
            "back": "1. Hides the details of resource management and failure handling so its users can focus on application development instead; 2. Operates with very high reliability and availability, and supports applications that do the same; and 3. Lets us run workloads across tens of thousands of machines effectively.",
            "front": "What are the three main benefits of Borg?"
        });

    });

});
