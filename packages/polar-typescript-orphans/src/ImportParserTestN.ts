import {ImportParser} from "./ImportParser";
import {assertJSON} from "polar-test/src/test/Assertions";
import {Files} from "polar-shared/src/util/Files";

xdescribe("ImportParser", function () {

    xit("basic parser", () => {

        const imports = ImportParser.parse("import {Foo} from './Foo'");

        assertJSON(imports, [
            "./Foo"
        ])

    });

    xit("basic parser with two imports", () => {

        const imports = ImportParser.parse("import {Foo} from './Foo'\nimport {Bar} from './Bar'");

        assertJSON(imports, [
            "./Foo", "./Bar"
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
