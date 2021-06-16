import {assertJSON} from "../../test/Assertions";
import { ReverseIndex } from "./ReverseIndex";

describe("ReverseIndex", () => {

    it("basic", () => {

        const index = new ReverseIndex();

        assertJSON(index.toJSON(), {});

        index.add('101', '100');
        assertJSON(index.toJSON(), {
            "101": [
                "100"
            ]
        });

        index.add('101', '99');
        assertJSON(index.toJSON(), {
            "101": [
                "100",
                "99"
            ]
        });

        index.remove('101', '100');
        assertJSON(index.toJSON(), {
            "101": [
                "99"
            ]
        });

        index.remove('101', '99');
        assertJSON(index.toJSON(), {});

    });


});

