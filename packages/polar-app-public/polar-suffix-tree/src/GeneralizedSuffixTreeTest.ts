import {GeneralizedSuffixTree} from "./GeneralizedSuffixTree";
import {assert} from "chai";

describe("GeneralizedSuffixTree", function() {

    it("basic", () => {

        const gst = new GeneralizedSuffixTree();
        gst.put("hello", 1);
        gst.put("world", 2);
        gst.put("loop", 3);
        gst.put("little orange", 4);
        gst.put("hlasdfhadglloo", 5);

        const results = gst.search('lo');

        assert.deepEqual(results, new Set([1, 3, 5]));

    });

})
