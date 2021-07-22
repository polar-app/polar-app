import {GeneralizedSuffixTree} from "./GeneralizedSuffixTree";
import {assertJSON} from "polar-test/src/test/Assertions";

describe("GeneralizedSuffixTree", function() {

    it("basic", () => {

        const gst = new GeneralizedSuffixTree();
        gst.put("hello", 1);
        gst.put("world", 2);

        assertJSON(gst.search('ello'), {});

    });

})
