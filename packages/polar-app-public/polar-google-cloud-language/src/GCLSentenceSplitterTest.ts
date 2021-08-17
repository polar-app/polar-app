import {GCLSentenceSplitter} from "./GCLSentenceSplitter";

describe("GCLSentenceSplitter", function() {
    it("basic", async function() {
        await GCLSentenceSplitter.split("This is the first sentence.  This is the second sentence.");
    });
})
