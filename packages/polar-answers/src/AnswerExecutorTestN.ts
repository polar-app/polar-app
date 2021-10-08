import {assert} from 'chai';
import {AnswerExecutor} from "./AnswerExecutor";
import {Arrays} from "polar-shared/src/util/Arrays";
import {IAnswerExecutorError} from "polar-answers-api/src/IAnswerExecutorResponse";
import {AnswerTests} from "./AnswerTests";
import getUID = AnswerTests.getUID;
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";

describe("Answer Executor", function () {

    this.timeout(600000);

    async function executeQuestion(question: string, forEmail = 'burton@inputneuron.io') {

        const uid = await getUID(forEmail);

        const answerExecution = await AnswerExecutor.exec({
            uid,
            question,
            model: 'curie',
            search_model: 'curie',
            documents_limit: 1,
            rerank_elasticsearch: true,
            rerank_elasticsearch_model: 'ada',
            rerank_truncate_short_head: true,
            prune_contiguous_records: true,
        });

        const {response} = answerExecution;

        function isError(value: any): value is IAnswerExecutorError {
            return value.error === true;
        }

        if (! isError(response)) {

            console.log("answer: ", Arrays.first(response.answers))

            console.log("response: " + JSON.stringify(response, null, '  '));
            console.log("prompt: " + response.prompt);

            return response.answers[0];

        } else {
            throw new Error(response.code);
        }

    }

    // TODO: this fails now with 'Sera drawn between 7 and 17 days after a second dose of' for some reason.
    it("What is a Planet?", async function () {

        const answer = await executeQuestion("What is a Planet?");
        assert.isDefined(answer);

    });

    it("default request", () => {
        assertJSON(AnswerExecutor.computeRequestWithDefaults({uid: '101', question: "What is the meaning of life?"}), {
            "documents_limit": 200,
            "elasticsearch_sort_order": "idx",
            "elasticsearch_truncate_short_head": {
                "max_docs": 50,
                "min_docs": 50,
                "target_angle": 30
            },
            "filter_question": "part-of-speech-noun",
            "filter_question_joiner": "OR",
            "max_tokens": 125,
            "model": "curie",
            "openai_completion_cleanup_enabled": true,
            "prune_contiguous_records": true,
            "question": "What is the meaning of life?",
            "rerank_elasticsearch": true,
            "rerank_elasticsearch_model": "ada",
            "rerank_elasticsearch_size": 500,
            "rerank_truncate_short_head": true,
            "search_model": "curie",
            "uid": "101"
        })
    });

})


