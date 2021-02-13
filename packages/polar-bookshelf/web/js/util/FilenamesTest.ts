import {assert} from 'chai';
import {Filenames} from './Filenames';

describe('Filenames', function() {

    describe('sanitize', function() {

        it("basic", function () {
            assert.equal(Filenames.sanitize("Hello!(@#&^!~)world99"), "Hello_________world99");
        });

    });

});
