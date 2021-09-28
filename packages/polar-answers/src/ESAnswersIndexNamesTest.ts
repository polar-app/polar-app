import {AnswerTests} from "./AnswerTests";
import getUID = AnswerTests.getUID;
import {ESAnswersIndexNames} from "./ESAnswersIndexNames";
import {assert} from 'chai';

describe("ESAnswersIndexNames", function() {
    it("basic", async () => {

        const uid = await getUID();

        assert.equal(ESAnswersIndexNames.createForUserDocs(uid), 'ai_ft_digest_docs_545445733244727031386635397a6645633050336966426f62503932');

    });
})
