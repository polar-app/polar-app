import {SentenceShingler} from "./SentenceShingler";
import {assertJSON} from "polar-test/src/test/Assertions";

describe("SentenceShingler", function() {

    it("basic", async function() {

        const content = "This is the first sentence. This is the second sentence.  This is the third sentence.  This is the 4th.  This is the 5th sentence. This is the 6th sentence.";

        const shingles = await SentenceShingler.computeShinglesFromContent(content)

        assertJSON(shingles,[
            {
                "text": "This is the first sentence.  This is the second sentence.  This is the third sentence.  This is the 4th."
            },
            {
                "text": "This is the third sentence.  This is the 4th.  This is the 5th sentence.  This is the 6th sentence."
            }
        ])

    });

    it("odd with potential trailing... ", async function() {

        const content = "This is the first sentence. This is the second sentence.  This is the third sentence.  This is the 4th.  This is the 5th sentence";

        const shingles = await SentenceShingler.computeShinglesFromContent(content)

        // verify we don't have a bug due to missing a last shingle that's impartial.

        assertJSON(shingles, [
            {
                "text": "This is the first sentence.  This is the second sentence.  This is the third sentence.  This is the 4th."
            },
            {
                "text": "This is the second sentence.  This is the third sentence.  This is the 4th.  This is the 5th sentence"
            }
        ])

    });


})
