import {DictionaryPrefs} from "./Prefs";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {assertJSON} from "polar-test/src/test/Assertions";

describe('Prefs', function() {

    beforeEach(() => {
        TestingTime.freeze();
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    describe('update', function() {

        it("basic", function () {

            const prefs0 = new DictionaryPrefs();
            const prefs1 = new DictionaryPrefs();

            const key = 'animal';

            prefs0.set(key, 'dog');

            TestingTime.forward('1w');

            prefs1.set(key, 'cat');

            // now update them both ways.
            prefs1.update(prefs0.toPrefDict());
            prefs0.update(prefs1.toPrefDict());

            const expected = {
                "animal": {
                    "key": "animal",
                    "value": "cat",
                    "written": "2012-03-09T11:38:49.321Z"
                }
            };

            assertJSON(prefs0.toPrefDict(), expected);
            assertJSON(prefs1.toPrefDict(), expected);

        });

    });

});
