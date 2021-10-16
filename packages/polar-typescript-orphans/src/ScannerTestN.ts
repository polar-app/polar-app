import {Scanner} from "./Scanner";
import {assertJSON} from "polar-test/src/test/Assertions";

describe("Scanner", function() {

    xit("basic", async () => {

        const references = await Scanner.doScan('test', '.');

        assertJSON(references, {})

    });

})
