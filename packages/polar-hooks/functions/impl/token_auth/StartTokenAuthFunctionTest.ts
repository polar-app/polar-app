import { createChallenge } from "./StartTokenAuthFunction";
import {assert} from 'chai';
import {Numbers} from "polar-shared/src/util/Numbers";

describe('StartTokenAuthFunction', function() {

    it("basic", function() {

        for(const idx of Numbers.range(1, 100)) {

            const {challenge, p0, p1} = createChallenge();
            assert.equal(p0.length, 3);
            assert.equal(p1.length, 3);
            assert.equal(challenge.length, 6);

            console.log(challenge);

        }

    });

});
