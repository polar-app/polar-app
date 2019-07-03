import {assertJSON} from '../test/Assertions';
import {ArrayListMultimap} from "./Multimap";

describe('Multimap', function() {

    it("same value", function() {

        const multimap = new ArrayListMultimap<string, string>();
        multimap.put('foo', 'bar');

        assertJSON(multimap.keys(), ['foo']);

        multimap.delete('foo');

        assertJSON(multimap.keys(), []);

    });


});
