import {ThumbnailGenerator} from "./ThumbnailGenerator";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Files} from "polar-shared/src/util/Files";

describe('ThumbnailGenerator', function() {

    it("basic", async function() {

        this.timeout(60000);

        const url = FilePaths.toURL("/home/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

        const buff = await ThumbnailGenerator.generate(url);

        await Files.writeFileAsync('/tmp/test.png', buff);


    });

});
