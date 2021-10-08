import {assert} from 'chai';
import {QuestionFilters} from "./QuestionFilters";

describe("QuestionFilters", function() {

    it("two terms", async () => {

        // TODO: we may want to re-write this to take into consideration contiguous nouns as single terms.
        const query = await QuestionFilters.filter("Who is Hillary Clinton and how is she related to Bill Clinton?", 'part-of-speech-noun', 'AND');
        assert.equal(query, "(Hillary) AND (Clinton) AND (Bill) AND (Clinton)");

    });

});
