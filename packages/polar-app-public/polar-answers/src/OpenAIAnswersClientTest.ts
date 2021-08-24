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

    it("basic", async function() {

        const request: OpenAIAnswersClient.IRequest = {
            search_model: SEARCH_MODEL,
            model: MODEL,
            question: "Is Bigtable relational?",
            examples_context: EXAMPLES_CONTEXT,
            examples: EXAMPLES,
            max_tokens: MAX_TOKENS,
            stop: STOP,
            documents: [],
            n: 10,

            // FIXME: I have to play with temperature more...
            temperature: 0
        }

        const answerResponse = await OpenAIAnswersClient.exec(request);

        assert.equal("__UNKNOWN__", answerResponse.answers[0]);
        console.log(answerResponse)

    });

})

