"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const TextHighlightRecords_1 = require("./TextHighlightRecords");
const Assertions_1 = require("../test/Assertions");
const Rect_1 = require("../Rect");
TestingTime_1.TestingTime.freeze();
describe('TextHighlightRecords', function () {
    describe('create', function () {
        it("basic", function () {
            const rects = [new Rect_1.Rect({ top: 100, left: 100, right: 200, bottom: 200, width: 100, height: 100 })];
            const textSelections = [{ text: "hello world", rect: rects[0] }];
            const text = "hello world";
            const textHighlightRecord = TextHighlightRecords_1.TextHighlightRecords.create(rects, textSelections, { TEXT: text });
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
            Assertions_1.assertJSON(textHighlightRecord, expected);
        });
    });
});
//# sourceMappingURL=TextHighlightRecordsTest.js.map