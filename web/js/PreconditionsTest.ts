import {assert} from 'chai';
import {Preconditions} from './Preconditions';

describe('Preconditions', function() {

    describe('defaultValue', function() {

        it("With null currentValue", function() {
            assert.equal(Preconditions.defaultValue(null, "hello"), "hello");
        });

        it("With undefined currentValue", function() {
            assert.equal(Preconditions.defaultValue(undefined, "hello"), "hello");
        });

        it("With existing value", function() {
            assert.equal(Preconditions.defaultValue("bye", "hello"), "bye");
        });

        it("With boolean values", function() {

            const foo: boolean | undefined = undefined;
            const value0: boolean = Preconditions.defaultValue(foo, true);
            assert.equal(value0, true);

            const value1: boolean = Preconditions.defaultValue(foo, false);
            assert.equal(value1, false);


        });
    });


});
