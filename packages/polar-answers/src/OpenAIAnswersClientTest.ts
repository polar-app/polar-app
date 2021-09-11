import {OpenAIAnswersClient} from "./OpenAIAnswersClient";
import {AnswerExecutor} from "./AnswerExecutor";
import {assert} from "chai";
import SEARCH_MODEL = AnswerExecutor.SEARCH_MODEL;
import MODEL = AnswerExecutor.MODEL;
import EXAMPLES_CONTEXT = AnswerExecutor.EXAMPLES_CONTEXT;
import EXAMPLES = AnswerExecutor.EXAMPLES;
import MAX_TOKENS = AnswerExecutor.MAX_TOKENS;
import STOP = AnswerExecutor.STOP;

xdescribe("OpenAIAnswersClient", function() {

    this.timeout(30000);

    describe("with no docs", () => {

        async function assertQuestionAndAnswer(question: string, expectedAnswer: string, opts: Partial<OpenAIAnswersClient.IOpenAIAnswersRequest> = {}) {

            const documents = opts.documents || [];

            const request: OpenAIAnswersClient.IOpenAIAnswersRequest = {
                search_model: SEARCH_MODEL,
                model: MODEL,
                question,
                examples_context: EXAMPLES_CONTEXT,
                examples: EXAMPLES,
                max_tokens: MAX_TOKENS,
                stop: STOP,
                documents,
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

        it("broken text", async function() {

            await assertQuestionAndAnswer("What is Google Analytics?", "Google Analytics is a service that helps webmasters analyze traffic patterns at their web sites.", {
                documents: [
                    'In the rest of this section, we briefly\n' +
                    'describe how three product teams use Bigtable.  ' +
                    'Google Analytics is a service that helps webmasters analyze traffic patterns at their web sites.  It provides aggregate statistics, such as the number of unique visitors per day and the page views ' +
                    'per URL per day, as well as site-tracking reports, such as ' +
                    'the percentage of users that made a purchase, given that ' +
                    'they earlier viewed a specific page.  To enable the service, webmasters embed a  small ' +
                    'JavaScript program in their web pages. '
                ]
            });

        });

        it("with N = 1", async function() {

            const question = "Who run's the Space Program?";

            const documents: ReadonlyArray<string> = [
                "NASA runs the space program."
            ];

            const request: OpenAIAnswersClient.IOpenAIAnswersRequest = {
                search_model: SEARCH_MODEL,
                model: MODEL,
                question,
                examples_context: EXAMPLES_CONTEXT,
                examples: EXAMPLES,
                max_tokens: MAX_TOKENS,
                stop: STOP,
                documents,
                n: 1,
                temperature: 0
            }

            const answerResponse = await OpenAIAnswersClient.exec(request);

            assert.equal(answerResponse.answers.length, 1);
            assert.equal(answerResponse.answers[0], "NASA.");

        });


    });


})

