import { DateContents } from "./DateContents";
import {assertJSON} from "../../test/Assertions";
import {TestingTime} from "polar-shared/src/test/TestingTime";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {assert} from 'chai';

describe('DateContents', function() {


    beforeEach(() => {
        TestingTime.freeze()
    });

    afterEach(() => {
        TestingTime.unfreeze();
    });

    it('basic', () => {

        TestingTime.freeze('2012-01-01T00:00:00.000Z')

        assert.equal(ISODateTimeStrings.create(), "2012-01-01T00:00:00.000Z");

        assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'en-US'}), {
            "data": "December 31, 2011",
            "format": "MMMM D, YYYY",
            "locale": "en-US",
            "timezone": "America/Bogota",
            "type": "date"
        });

        TestingTime.forward('5d');

        assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'en-US'}), {
            "data": "January 5, 2012",
            "format": "MMMM D, YYYY",
            "locale": "en-US",
            "timezone": "America/Bogota",
            "type": "date"
        });

        assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'es-US'}), {
            "data": "Enero 5, 2012",
            "format": "MMMM D, YYYY",
            "locale": "es-US",
            "timezone": "America/Bogota",
            "type": "date"
        });
        //
        // assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'ja-JP'}), {
        //     "data": "Enero 5, 2012",
        //     "format": "MMMM D, YYYY",
        //     "locale": "ja-JP",
        //     "timezone": "America/Bogota",
        //     "type": "date"
        // });


        //
        // assertJSON(DateContents.create({timezone: "America/Bogota", locale: 'es-US'}), {
        //     "data": "Mar 2, 2012",
        //     "format": "MMM D, YYYY",
        //     "locale": "en-US",
        //     "timezone": "America/Bogota",
        //     "type": "date"
        // });

    });

});
