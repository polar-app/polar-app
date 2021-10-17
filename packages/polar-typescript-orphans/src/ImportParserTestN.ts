import {ImportParser} from "./ImportParser";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Files} from "polar-shared/src/util/Files";

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

    it("import $", () => {

        const content = "import $ from '../../../../ui/JQuery';\n"

        const imports = ImportParser.parse(content);

        assertJSON(imports, [
            "../../../../ui/JQuery"
        ])


    });


    it("import polar-bookshelf/blah", () => {

        const content = "import {Blah} from 'polar-bookshelf/Blah/Blah.ts';\n"

        const imports = ImportParser.parse(content);

        assertJSON(imports, [
            "polar-bookshelf/Blah/Blah.ts"
        ])


    });

    describe("resolve", () => {

        xit("basic", async () => {

            const path = "/Users/burton/projects/polar-app/packages/polar-bookshelf/apps/doc/src/DocViewer.tsx";

            const buff = await Files.readFileAsync(path);
            const content = buff.toString("utf-8");

            const imports = ImportParser.parse(content).filter(ImportParser.accept);

            const promises = imports.map(current => ImportParser.resolve(path, current));
            const resolved = await Promise.all(promises);

            console.log(resolved);

        });

    });

})
