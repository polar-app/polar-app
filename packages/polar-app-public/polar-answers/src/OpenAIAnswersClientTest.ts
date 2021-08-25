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

        async function assertQuestionAndAnswer(question: string, expectedAnswer: string, opts: Partial<OpenAIAnswersClient.IRequest> = {}) {

            const documents = opts.documents || [];

            const request: OpenAIAnswersClient.IRequest = {
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

        xit("broken text", async function() {

            await assertQuestionAndAnswer("What is Google Analytics?", "", {
                documents: [
                    'In the rest of this section, we brie y\n' +
                    'describe how three product teams use Bigtable.  8.1 Google Analytics\n' +
                    'Google Analytics (analytics.google.com)  is a service\n' +
                    'that helps webmasters analyze traf c patterns at their\n' +
                    'web sites.  It provides aggregate statistics, such as the\n' +
                    'number of unique visitors per day and the page views\n' +
                    'per URL per day, as well as site-tracking reports, such as\n' +
                    'the percentage of users that made a purchase, given that\n' +
                    'they earlier viewed a speci c page.  To enable the service, webmasters embed a  small\n' +
                    'JavaScript program in their web pages. '
                ]
            });

        });

    });


})

