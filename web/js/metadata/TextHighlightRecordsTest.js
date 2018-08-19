var assert = require('assert');

const {TextHighlight} = require("./TextHighlight");
const {TextHighlightRecords} = require("./TextHighlightRecords");
const {assertJSON} = require("../test/Assertions");

require("../test/TestingTime").freeze();

describe('TextHighlightRecords', function() {

    describe('create', function() {

        it("basic", function () {

            let rects = [ {top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100}];
            let textSelections = ["hello world"];
            let text = "hello world";

            // create a basic TextHighlight object..
            let textHighlightRecord = TextHighlightRecords.create(rects, textSelections, text);

            let expected = {
                "id": "12pNUv1Y9S",
                "value": {
                    "id": "12pNUv1Y9S",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "rects": {
                        "0": {
                            "top": 100,
                            "left": 100,
                            "right": 200,
                            "bottom": 200,
                            "width": 100,
                            "height": 100
                        }
                    },
                    "textSelections": {
                        "0": "hello world"
                    },
                    "text": "hello world",
                    "notes": {},
                    "questions": {},
                    "flashcards": {}
                }
            };

            assertJSON(textHighlightRecord, expected)

        });

    });

});
