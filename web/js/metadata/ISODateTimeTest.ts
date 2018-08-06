import {Flashcards} from './Flashcards';
import {ISODateTime} from './ISODateTime';
import assert from 'assert';

require("../test/TestingTime").freeze();

describe('Flashcards', function() {

    it("from object", function () {
        assert.ok(new ISODateTime({ 'value': ISODateTime.EPOCH.toString() }).equals(ISODateTime.EPOCH));
    });


    it("from string", function () {
        assert.ok(new ISODateTime({ 'value': ISODateTime.EPOCH.toString() }).equals(ISODateTime.EPOCH));
    });


    it("from ISODateTime", function () {
        assert.ok(new ISODateTime(ISODateTime.EPOCH).equals(ISODateTime.EPOCH));
    });

    it("from Date", function () {
        assert.ok(new ISODateTime(ISODateTime.EPOCH.toDate()).equals(ISODateTime.EPOCH));
    });

});
