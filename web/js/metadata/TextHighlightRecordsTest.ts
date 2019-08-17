import {TestingTime} from '../test/TestingTime';
import {TextHighlightRecords} from './TextHighlightRecords';
import {assertJSON} from '../test/Assertions';
import {Rect} from '../Rect';
import {TextRect} from './TextRect';

TestingTime.freeze();

describe('TextHighlightRecords', function() {

    describe('create', function() {

        it("basic", function () {

            const rects: Rect[] = [ new Rect({top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100})];
            const textSelections: TextRect[] = [{text: "hello world", rect: rects[0]}];
            const text = "hello world";

            // create a basic TextHighlight object..
            const textHighlightRecord = TextHighlightRecords.create(rects, textSelections, {TEXT: text});

            const expected = {
                "id": "1Af41QXbBH",
                "value": {
                    "id": "1Af41QXbBH",
                    "guid": "1Af41QXbBH",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "rects": {
                        "0": {
                            "left": 100,
                            "top": 100,
                            "right": 200,
                            "bottom": 200,
                            "width": 100,
                            "height": 100
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "hello world"
                        }
                    },
                    "text": {
                        "TEXT": "hello world"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "yellow"
                }
            };

            assertJSON(textHighlightRecord, expected);

        });

    });

});
