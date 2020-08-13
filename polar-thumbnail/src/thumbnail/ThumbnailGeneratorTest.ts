import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Files} from "polar-shared/src/util/Files";

xdescribe('ThumbnailGenerator', function() {

    it("basic", async function() {

        if (process.platform !== 'linux') {
            // this is only valid on Linux and doesn't matter for other platforms.
            return;
        }

        const {ThumbnailGenerator} = require("./ThumbnailGenerator");

        this.timeout(60000);

        const url = FilePaths.toURL("/home/burton/projects/polar-app/packages/polar-bookshelf/docs/examples/pdf/availability.pdf");

        const buff = await ThumbnailGenerator.generate(url);

        await Files.writeFileAsync('/tmp/test.png', buff);

    });

});
