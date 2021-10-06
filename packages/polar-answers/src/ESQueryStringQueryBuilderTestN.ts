import {assert} from 'chai';
import {ESQueryStringQueryBuilder} from "./ESQueryStringQueryBuilder";

describe("ESQueryStringQueryBuilder", function() {

    it("empty array", () => {

        assert.equal(ESQueryStringQueryBuilder.build([]), "");

    });

    it("single term", () => {

        assert.equal(ESQueryStringQueryBuilder.build(["hello"]), "(hello)");

    });


    it("two terms", () => {

        assert.equal(ESQueryStringQueryBuilder.build(["hello", "world"]), "(hello) AND (world)");

    });

})
