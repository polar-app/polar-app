import {assert} from "chai";
import {Challenges} from "./Challenges";
import { Numbers } from "./Numbers";

describe("Challenges", () => {

    it("basic", function() {

        for(const idx of Numbers.range(1, 100)) {

            const {challenge, p0, p1} = Challenges.create();
            assert.equal(p0.length, 3);
            assert.equal(p1.length, 3);
            assert.equal(challenge.length, 6);

            console.log(challenge);

        }

    });

});
