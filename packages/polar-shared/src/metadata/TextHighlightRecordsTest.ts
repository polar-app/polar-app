import {TestingTime} from '../test/TestingTime';
import {TextHighlightRecords} from './TextHighlightRecords';
import {assertJSON} from 'polar-test/src/test/Assertions';
import {Rect} from '../util/Rect';
import {ITextRect} from "./ITextRect";

describe('TextHighlightRecords', function() {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });


    describe('create', function() {

        it("basic", function () {

            const rects: readonly Rect[] = [ new Rect({top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100})];
            const textSelections: readonly ITextRect[] = [{text: "hello world", rect: rects[0]}];
            const text = "hello world";

            // create a basic TextHighlight object..
            const textHighlightRecord = TextHighlightRecords.create(rects, textSelections, {TEXT: text});

            const expected = {
                "id": "1Af41QXbBH",
                "value": {
                    "color": "yellow",
                    "created": "2012-03-02T11:38:49.321Z",
                    "flashcards": {},
                    "guid": "1Af41QXbBH",
                    "id": "1Af41QXbBH",
                    "images": {},
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "notes": {},
                    "questions": {},
                    "rects": {
                        "0": {
                            "bottom": 200,
                            "height": 100,
                            "left": 100,
                            "right": 200,
                            "top": 100,
                            "width": 100
                        }
                    },
                    "text": {
                        "TEXT": "hello world"
                    },
                    "textSelections": {
                        "0": {
                            "rect": {
                                "bottom": 200,
                                "height": 100,
                                "left": 100,
                                "right": 200,
                                "top": 100,
                                "width": 100
                            },
                            "text": "hello world"
                        }
                    }
                }
            };

            assertJSON(textHighlightRecord, expected);

        });

    });

});
