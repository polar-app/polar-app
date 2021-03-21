import {SortFunctions} from "./SortFunctions";
import {assertJSON} from "../../../../../web/js/test/Assertions";

describe('SortFunctions', function() {

    it("basic", function() {

        const sorted = ['', '', 'cat', 'bar']
            .sort((a, b) => SortFunctions.compareWithEmptyStringsLast(a, b, (value) => value));

        assertJSON(sorted, ["bar", "cat", "", ""]);

    });

});
