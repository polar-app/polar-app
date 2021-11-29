import {assert} from 'chai';
import {Hashcodes} from './Hashcodes';

describe('Hashcodes', function() {

    it("create", function () {
        const hashcode = Hashcodes.create("asdf");
        assert.equal(hashcode, "1aibZzMnnHwqHd9cmMb2QrRdgyBj5ppNHgCTqxqggN8KRN4jtu");
    });

    it("createHashcode", function () {

        const hashcode = Hashcodes.createHashcode("asdf");
        assert.deepEqual(hashcode, {
            "alg": "keccak256",
            "data": "1aibZzMnnHwqHd9cmMb2QrRdgyBj5ppNHgCTqxqggN8KRN4jtu",
            "enc": "base58check"
        });

    });

    it("createID", function () {

        const hashcode = Hashcodes.createID("asdf");
        assert.equal(hashcode, "12CNLPYNFs");

    });

    it("createRandomID", function () {

        const hashcode = Hashcodes.createRandomID();
        assert.isNotNull(hashcode);
        assert.isDefined(hashcode);

        assert.equal(hashcode.length, 10);

    });

    it("createRandomID with full length", function () {

        const hashcode = Hashcodes.createRandomID({len: Infinity});
        assert.isNotNull(hashcode);
        assert.isDefined(hashcode);

        assert.isTrue(hashcode.length === 43 || hashcode.length === 44);

    });


});
