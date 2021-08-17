import {SentenceShingler} from "./SentenceShingler";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";

xdescribe("SentenceShingler", async function() {

    it("basic", async function() {

        const content = "This is the first sentence. This is the second sentence.  This is the third sentence.  This is the 5th sentence. This is the 6th sentence.";

        const shingles = SentenceShingler.computeShinglesFromContent(content)

        assertJSON(shingles, [])

    });

})
