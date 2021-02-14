import { createChallenge } from "./StartTokenAuthFunction";
import {assert} from 'chai';
import {Numbers} from "polar-shared/src/util/Numbers";

describe('StartTokenAuthFunction', function() {

    it("basic", function() {

        for(const idx of Numbers.range(1, 100)) {

            const {value, p0, p1} = createChallenge();
            assert.equal(p0.length, 3);
            assert.equal(p1.length, 3);
            assert.equal(value.length, 6);

            console.log(value);

        }

    });

});
