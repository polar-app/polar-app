import {GCLAnalyzeSyntax} from "./GCLAnalyzeSyntax";
import {assertJSON} from "polar-bookshelf/web/js/test/Assertions";

describe("GCLAnalyzeSyntax", function() {
    it("basic", async function() {
        const analysis = await GCLAnalyzeSyntax.analyzeSyntax("Barack Obama was a US President");
        console.log();

        assertJSON(JSON.stringify(analysis, null, '  '), [
            {
                "sentences": [
                    {
                        "text": {
                            "content": "Barack Obama was a US President",
                            "beginOffset": 0
                        },
                        "sentiment": null
                    }
                ],
                "tokens": [
                    {
                        "text": {
                            "content": "Barack",
                            "beginOffset": 0
                        },
                        "partOfSpeech": {
                            "tag": "NOUN",
                            "aspect": "ASPECT_UNKNOWN",
                            "case": "CASE_UNKNOWN",
                            "form": "FORM_UNKNOWN",
                            "gender": "GENDER_UNKNOWN",
                            "mood": "MOOD_UNKNOWN",
                            "number": "SINGULAR",
                            "person": "PERSON_UNKNOWN",
                            "proper": "PROPER",
                            "reciprocity": "RECIPROCITY_UNKNOWN",
                            "tense": "TENSE_UNKNOWN",
                            "voice": "VOICE_UNKNOWN"
                        },
                        "dependencyEdge": {
                            "headTokenIndex": 1,
                            "label": "NN"
                        },
                        "lemma": "Barack"
                    },
                    {
                        "text": {
                            "content": "Obama",
                            "beginOffset": 7
                        },
                        "partOfSpeech": {
                            "tag": "NOUN",
                            "aspect": "ASPECT_UNKNOWN",
                            "case": "CASE_UNKNOWN",
                            "form": "FORM_UNKNOWN",
                            "gender": "GENDER_UNKNOWN",
                            "mood": "MOOD_UNKNOWN",
                            "number": "SINGULAR",
                            "person": "PERSON_UNKNOWN",
                            "proper": "PROPER",
                            "reciprocity": "RECIPROCITY_UNKNOWN",
                            "tense": "TENSE_UNKNOWN",
                            "voice": "VOICE_UNKNOWN"
                        },
                        "dependencyEdge": {
                            "headTokenIndex": 2,
                            "label": "NSUBJ"
                        },
                        "lemma": "Obama"
                    },
                    {
                        "text": {
                            "content": "was",
                            "beginOffset": 13
                        },
                        "partOfSpeech": {
                            "tag": "VERB",
                            "aspect": "ASPECT_UNKNOWN",
                            "case": "CASE_UNKNOWN",
                            "form": "FORM_UNKNOWN",
                            "gender": "GENDER_UNKNOWN",
                            "mood": "INDICATIVE",
                            "number": "SINGULAR",
                            "person": "THIRD",
                            "proper": "PROPER_UNKNOWN",
                            "reciprocity": "RECIPROCITY_UNKNOWN",
                            "tense": "PAST",
                            "voice": "VOICE_UNKNOWN"
                        },
                        "dependencyEdge": {
                            "headTokenIndex": 2,
                            "label": "ROOT"
                        },
                        "lemma": "be"
                    },
                    {
                        "text": {
                            "content": "a",
                            "beginOffset": 17
                        },
                        "partOfSpeech": {
                            "tag": "DET",
                            "aspect": "ASPECT_UNKNOWN",
                            "case": "CASE_UNKNOWN",
                            "form": "FORM_UNKNOWN",
                            "gender": "GENDER_UNKNOWN",
                            "mood": "MOOD_UNKNOWN",
                            "number": "NUMBER_UNKNOWN",
                            "person": "PERSON_UNKNOWN",
                            "proper": "PROPER_UNKNOWN",
                            "reciprocity": "RECIPROCITY_UNKNOWN",
                            "tense": "TENSE_UNKNOWN",
                            "voice": "VOICE_UNKNOWN"
                        },
                        "dependencyEdge": {
                            "headTokenIndex": 5,
                            "label": "DET"
                        },
                        "lemma": "a"
                    },
                    {
                        "text": {
                            "content": "US",
                            "beginOffset": 19
                        },
                        "partOfSpeech": {
                            "tag": "NOUN",
                            "aspect": "ASPECT_UNKNOWN",
                            "case": "CASE_UNKNOWN",
                            "form": "FORM_UNKNOWN",
                            "gender": "GENDER_UNKNOWN",
                            "mood": "MOOD_UNKNOWN",
                            "number": "SINGULAR",
                            "person": "PERSON_UNKNOWN",
                            "proper": "PROPER",
                            "reciprocity": "RECIPROCITY_UNKNOWN",
                            "tense": "TENSE_UNKNOWN",
                            "voice": "VOICE_UNKNOWN"
                        },
                        "dependencyEdge": {
                            "headTokenIndex": 5,
                            "label": "NN"
                        },
                        "lemma": "US"
                    },
                    {
                        "text": {
                            "content": "President",
                            "beginOffset": 22
                        },
                        "partOfSpeech": {
                            "tag": "NOUN",
                            "aspect": "ASPECT_UNKNOWN",
                            "case": "CASE_UNKNOWN",
                            "form": "FORM_UNKNOWN",
                            "gender": "GENDER_UNKNOWN",
                            "mood": "MOOD_UNKNOWN",
                            "number": "SINGULAR",
                            "person": "PERSON_UNKNOWN",
                            "proper": "PROPER",
                            "reciprocity": "RECIPROCITY_UNKNOWN",
                            "tense": "TENSE_UNKNOWN",
                            "voice": "VOICE_UNKNOWN"
                        },
                        "dependencyEdge": {
                            "headTokenIndex": 2,
                            "label": "ATTR"
                        },
                        "lemma": "President"
                    }
                ],
                "language": "en"
            },
            null,
            null
        ])

    });
})
