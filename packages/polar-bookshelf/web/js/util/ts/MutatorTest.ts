import {Mutator} from './Mutator';
import {assert} from 'chai';

describe('Mutator', function() {

    it("Test mutation", function() {

        let name: Readonly<Name> = {
            first: 'Alice',
            last: 'Smith'
        };

        // this will give us a compilation error
        // name.first = 'Bob';

        name = Mutator.mutate(name, (current) => {
            current.first = 'Bob';
            // FIXME: it's too easy to return the wrong object here. I have to
            // find a way to return the non-mutable version...
            return current;
        });

        // this will still give a compilation error.
        // name.first = 'Bob';

        // yet this works.
        assert.equal(name.first, 'Bob');

    });

});

interface Name {
    first: string;
    last: string;
}
