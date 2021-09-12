import {StripeStudentDiscountFunctions, StudentDiscountUniversities} from "./StripeStudentDiscountFunctions";
import {assert} from 'chai';

describe('StripeStudentDiscountFunctions', function() {

    it("basic", async function() {

        assert.ok(StudentDiscountUniversities.getUniversityForEmail('foo@mit.edu'));
        assert.ok(StudentDiscountUniversities.getUniversityForEmail('foo@example.mit.edu'));

        assert.isUndefined(StudentDiscountUniversities.getUniversityForEmail('foo@gmail.com'));

    });

});