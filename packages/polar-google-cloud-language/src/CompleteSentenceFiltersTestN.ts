import {GCLAnalyzeSyntax} from "./GCLAnalyzeSyntax";
import {CompleteSentenceFilters} from "./CompleteSentenceFilters";
import {assertJSON} from "polar-test/src/test/Assertions";
import {assert} from 'chai';

describe("CompleteSentenceFilters", function() {

    it("Basic without punctuation at the end.", async () => {

        const analysis = await GCLAnalyzeSyntax.analyzeSyntax("Barack Obama was a US President");
        const filtered = CompleteSentenceFilters.filter({
            sentences: analysis.sentences,
            tokens: analysis.tokens || []
        })

        assertJSON(filtered, [
            {
                "text": {
                    "content": "Barack Obama was a US President",
                    "beginOffset": 0
                }
            }
        ]);

    });

    it("Basic with punctuation at the end.", async () => {

        const analysis = await GCLAnalyzeSyntax.analyzeSyntax("Barack Obama was a US President?");
        const filtered = CompleteSentenceFilters.filter({
            sentences: analysis.sentences,
            tokens: analysis.tokens || []
        })

        assertJSON(filtered, [
            {
                "text": {
                    "content": "Barack Obama was a US President?",
                    "beginOffset": 0
                }
            }
        ]);

    });

    it("Partial before and after", async () => {

        const analysis = await GCLAnalyzeSyntax.analyzeSyntax("1. Barack Obama was a US President? blah blah blah?");

        assert.equal(analysis.sentences?.length, 3);

        const filtered = CompleteSentenceFilters.filter({
            sentences: analysis.sentences,
            tokens: analysis.tokens || []
        })

        assertJSON(filtered, [
            {
                "text": {
                    "content": "Barack Obama was a US President?",
                    "beginOffset": 3
                }
            }
        ]);

    });


    describe("_computeSentencesWithTokens", () => {

        it("Just one sentence", async () => {

            const analysis = await GCLAnalyzeSyntax.analyzeSyntax("Barack Obama was a US President");
            const sentences = analysis.sentences || [];
            const sentencePointers = CompleteSentenceFilters._computeSentencePointers(sentences);
            const sentencesWithTokens = CompleteSentenceFilters._computeSentencesWithTokens(sentences, sentencePointers, analysis.tokens || []);

            assert.equal(sentencesWithTokens.length, 1)
            assert.equal(sentencesWithTokens[0].tokens.length, 6)

        });

        it("Multiple sentences", async () => {

            const analysis = await GCLAnalyzeSyntax.analyzeSyntax("1. Barack Obama was a US President? blah blah blah?");

            console.log(JSON.stringify(analysis, null, '  '));

            const sentences = analysis.sentences || [];
            const sentencePointers = CompleteSentenceFilters._computeSentencePointers(sentences);
            const sentencesWithTokens = CompleteSentenceFilters._computeSentencesWithTokens(sentences, sentencePointers, analysis.tokens || []);

            assert.equal(sentencesWithTokens.length, 3)
            assert.equal(sentencesWithTokens[0].tokens.length, 2)
            assert.equal(sentencesWithTokens[1].tokens.length, 7)
            assert.equal(sentencesWithTokens[2].tokens.length, 4)

        });

    });

})
