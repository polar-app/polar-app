import {assert} from 'chai';
import {Progress} from './Progress';
import {ResolvablePromise} from './ResolvablePromise';
import {TestingTime} from '../test/TestingTime';
import {Sequences} from './Sequences';
import {ISODateTimeStrings} from '../metadata/ISODateTimeStrings';


describe('Sequences', function() {

    it("Large machine and nonces", async function() {

        TestingTime.freeze();

        Sequences.MACHINE = 999999999999;
        Sequences.NONCE = 999999999999;

        const seq = Sequences.create();
        console.log("seq: " + seq);

        assert.equal(seq, "2012-02-02-11-38-321-000000-999999999999");

    });


    it("Small machine and nonces", async function() {

        TestingTime.freeze();

        Sequences.MACHINE = 0;
        Sequences.NONCE = 0;

        const seq = Sequences.create();
        console.log("seq: " + seq);

        assert.equal(seq, "2012-02-02-11-38-321-000000-000000000000");

        console.log("FIXME::" + ISODateTimeStrings.create());

    });


});


