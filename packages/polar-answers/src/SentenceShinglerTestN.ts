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

    it("sentence fragments", async () => {
        const content = "7. Which term describes German soldiers hired by Great Britain to put down the American rebellion? A. Patriots B. Royalists C. Hessians D. Loyalists 8. Describe the British strategy in the early years of the war and explain whether or not it succeeded. 9. How did George Washington’s military tactics help him to achieve success? 10. Which American general is responsible for improving the American military position in the South? A. John Burgoyne B. Nathanael Greene C. Wilhelm Frederick von Steuben D. Charles Cornwallis 11. Describe the British southern strategy and its results."

        const shingles = await SentenceShingler.computeShinglesFromContent(content)

        // verify we don't have a bug due to missing a last shingle that's impartial.

        assertJSON(shingles, [
            {
                "text": "7.  Which term describes German soldiers hired by Great Britain to put down the American rebellion?  A. Patriots B. Royalists C. Hessians D. Loyalists 8.  Describe the British strategy in the early years of the war and explain whether or not it succeeded."
            },
            {
                "text": "A. Patriots B. Royalists C. Hessians D. Loyalists 8.  Describe the British strategy in the early years of the war and explain whether or not it succeeded.  9.  How did George Washington’s military tactics help him to achieve success?"
            },
            {
                "text": "9.  How did George Washington’s military tactics help him to achieve success?  10.  Which American general is responsible for improving the American military position in the South?"
            },
            {
                "text": "10.  Which American general is responsible for improving the American military position in the South?  A. John Burgoyne B. Nathanael Greene C. Wilhelm Frederick von Steuben D. Charles Cornwallis 11.  Describe the British southern strategy and its results."
            }
        ])


    });

})
