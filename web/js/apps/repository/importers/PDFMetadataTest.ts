import {PDFMetadata} from './PDFMetadata';
import {Files} from '../../../../../web/js/util/Files';
import {HitMap} from '../../../util/HitMap';
import {Strings} from '../../../util/Strings';

describe('PDF Metadata', function() {
    this.timeout(999999);

    xit("basic", async function() {
        const pdfMeta = await PDFMetadata.getMetadata("/home/burton/Downloads/SSRN-id2594754.pdf");

        console.log(pdfMeta);
    });


    it("build property index", async function() {

        const hitMap = new HitMap();

        let nrFiles: number = 0;

        await Files.recursively("/d0/polar-pdf-set", async (path) => {

            if ( ! path.endsWith(".pdf")) {
                return;
            }

            console.log(path);

            const pdfMeta = await PDFMetadata.getMetadata(path);

            hitMap.registerHits(...Object.keys(pdfMeta.props));
            ++nrFiles;

        });

        const percRanked = hitMap.toPercRanked(nrFiles);

        for (const current of percRanked) {

            const strIdx = Strings.lpad(current.idx, ' ', 4);
            const strKey = Strings.lpad(current.key, ' ', 45);
            const strPerc = Strings.lpad(current.perc, ' ', 4);
            const strHits = Strings.lpad(current.hits, ' ', 10);

            console.log(`${strIdx} ${strKey} ${strPerc} ${strHits}`);

        }

        // console.log("printing result");
        // console.log(hitMap.toRanked());

    });

});
