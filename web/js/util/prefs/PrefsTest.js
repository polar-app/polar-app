"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Prefs_1 = require("./Prefs");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const Assertions_1 = require("../../test/Assertions");
TestingTime_1.TestingTime.freeze();
describe('Prefs', function () {
    describe('update', function () {
        it("basic", function () {
            const prefs0 = new Prefs_1.DictionaryPrefs();
            const prefs1 = new Prefs_1.DictionaryPrefs();
            const key = 'animal';
            prefs0.set(key, 'dog');
            TestingTime_1.TestingTime.forward('1w');
            prefs1.set(key, 'cat');
            prefs1.update(prefs0.toPrefDict());
            prefs0.update(prefs1.toPrefDict());
            const expected = {
                "animal": {
                    "key": "animal",
                    "value": "cat",
                    "written": "2012-03-09T11:38:49.321Z"
                }
            };
            Assertions_1.assertJSON(prefs0.toPrefDict(), expected);
            Assertions_1.assertJSON(prefs1.toPrefDict(), expected);
        });
    });
});
//# sourceMappingURL=PrefsTest.js.map