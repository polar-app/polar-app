import {ImportParser} from "./ImportParser";
import {assertJSON} from "polar-test/src/test/Assertions";

describe("ImportParser", function () {

    it("basic parser", () => {

        const imports = ImportParser.parse("import {Foo} from './Foo'");

        assertJSON(imports, [
            "./Foo"
        ])

    });

    it("basic parser with two imports", () => {

        const imports = ImportParser.parse("import {Foo} from './Foo'\nimport {Bar} from './Bar'");

        assertJSON(imports, [
            "./Foo", "./Bar"
        ])

    });


})
