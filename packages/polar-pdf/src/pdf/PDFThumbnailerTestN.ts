import {assert} from 'chai';
import './JSDOMForPDFThumbnailer';
import {PDFThumbnailer} from "./PDFThumbnailer";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";

xdescribe('PDFThumbnailer', function() {

    this.timeout(120000);

    it('basic', async function () {

        const containerFactory = () => document.createElement('div');

        // Request URL:

        const thumbnail = await PDFThumbnailer.generate({
            pathOrURL: "https://storage.googleapis.com/polar-32b0f.appspot.com/stash/12XTZBtjiJUu9XcVChpKnfberQcjQNLWoGbGS7AF.pdf",
            scaleBy: "width",
            value: 200,
            containerFactory
        });

        const hash = Hashcodes.createHashcode(thumbnail.data);

        console.log(thumbnail.data);
        console.log({hash});

        assert.equal(hash.data, "1ELeVJkJqEVVTne4MHNoSHr7GbgtRn37W2Pc2tcGqUwMctbHu3");

    });

});
