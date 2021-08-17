import {SentenceShingler} from "./SentenceShingler";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";

describe("SentenceShingler", async function() {

    it("basic", async function() {

        const content = "This is the first sentence. This is the second sentence.  This is the third sentence.  This is the 4th.  This is the 5th sentence. This is the 6th sentence.";

        const shingles = await SentenceShingler.computeShinglesFromContent(content)

        assertJSON(shingles, [
            {
                "idx": 0,
                "text": "This is the first sentence.  This is the second sentence.  This is the third sentence.  This is the 4th."
            },
            {
                "idx": 1,
                "text": "This is the third sentence.  This is the 4th.  This is the 5th sentence.  This is the 6th sentence."
            },
            {
                "idx": 2,
                "text": "This is the 5th sentence.  This is the 6th sentence."
            }
        ])

    });

})
