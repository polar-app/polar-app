import {ImportParser} from "./ImportParser";
import {assertJSON} from "polar-test/src/test/Assertions";

describe("ImportParser", function () {

    it("basic parser", () => {

        const imports = ImportParser.parse("import {Foo} from './Foo'");

        assertJSON(imports, [
            "./Foo"
        ])

    });

})
