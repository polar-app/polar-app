import {GeneralizedSuffixTree} from "./GeneralizedSuffixTree";

describe("GeneralizedSuffixTree", function() {
    it("basic", () => {

        const gst = new GeneralizedSuffixTree();
        gst.put("hello", 0);
        gst.put("world", 0);

        gst.search('ell');

    });
})
