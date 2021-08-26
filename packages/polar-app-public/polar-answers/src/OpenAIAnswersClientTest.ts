import {OpenAIAnswersClient} from "./OpenAIAnswersClient";
import {AnswerExecutor} from "./AnswerExecutor";
import SEARCH_MODEL = AnswerExecutor.SEARCH_MODEL;
import MODEL = AnswerExecutor.MODEL;
import EXAMPLES_CONTEXT = AnswerExecutor.EXAMPLES_CONTEXT;
import EXAMPLES = AnswerExecutor.EXAMPLES;
import MAX_TOKENS = AnswerExecutor.MAX_TOKENS;
import STOP = AnswerExecutor.STOP;
import {assert} from "chai";

xdescribe("OpenAIAnswersClient", async function() {

    this.timeout(30000);

    describe("with no docs", () => {

        async function assertQuestionAndAnswer(question: string, expectedAnswer: string) {

            const request: OpenAIAnswersClient.IRequest = {
                search_model: SEARCH_MODEL,
                model: MODEL,
                question,
                examples_context: EXAMPLES_CONTEXT,
                examples: EXAMPLES,
                max_tokens: MAX_TOKENS,
                stop: STOP,
                documents: [],
                n: 10,
                temperature: 0
            }

            const answerResponse = await OpenAIAnswersClient.exec(request);

            assert.equal(answerResponse.answers[0], expectedAnswer);
            console.log(answerResponse)

        }

        it("basic", async function() {
            await assertQuestionAndAnswer("Is Bigtable relational?", "__UNKNOWN__");
            await assertQuestionAndAnswer("What is Bigtable?", "__UNKNOWN__");
            await assertQuestionAndAnswer("Who created Bigtable?", "__UNKNOWN__");
        });

    });


})

