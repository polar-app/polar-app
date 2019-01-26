import {PDFMetadata} from './PDFMetadata';
import {Files} from '../../../../../web/js/util/Files';
import {HitMap} from '../../../util/HitMap';

describe('PDF Metadata', function() {

    xit("basic", async function() {
        const pdfMeta = await PDFMetadata.getMetadata("/home/burton/Downloads/SSRN-id2594754.pdf");

        console.log(pdfMeta);
    });


    xit("build property index", async function() {

        const hitMap = new HitMap();

        await Files.recursively("/home/burton/.polar/stash", async (path) => {

            if ( ! path.endsWith(".pdf")) {
                return;
            }

            console.log(path);

            const pdfMeta = await PDFMetadata.getMetadata(path);

            hitMap.registerHits(...Object.keys(pdfMeta.props));

        });

        console.log("printing result");
        console.log(hitMap.toRanked());

    });

});
