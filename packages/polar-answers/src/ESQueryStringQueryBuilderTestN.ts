import {assert} from 'chai';
import {ESQueryStringQueryBuilder} from "./ESQueryStringQueryBuilder";

describe("ESQueryStringQueryBuilder", function() {

    it("empty array", () => {

        assert.equal(ESQueryStringQueryBuilder.buildAND([]), "");

    });

    it("single term", () => {

        assert.equal(ESQueryStringQueryBuilder.buildAND(["hello"]), "(hello)");

    });


    it("two terms", () => {

        assert.equal(ESQueryStringQueryBuilder.buildAND(["hello", "world"]), "(hello) AND (world)");

    });

})
