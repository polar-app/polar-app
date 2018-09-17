import {assert} from "chai";

describe('RegExp', function() {

    it("test unicode literal", function() {
        // noinspection TsLint

        // this highlights a bug in the twitter code. They have the ranges

        // noinspection TsLint
        new RegExp("[\ud83b-\\udea1]");

    });

});



