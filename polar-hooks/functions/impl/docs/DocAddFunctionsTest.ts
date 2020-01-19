import {AddURLs} from "polar-webapp-links/src/docs/AddURLs";
import {assert} from 'chai';
import {PreviewURLs} from "polar-webapp-links/src/docs/PreviewURLs";
import { URLParams } from "polar-shared/src/util/URLParams";

describe('DocAddFunctions', function() {

    it("parse", function() {

        const parsedURL = AddURLs.parse("https://app.getpolarized.io/add/?file=http://cdn.ca9.uscourts.gov/datastore/opinions/2019/09/09/17-16783.pdf&docInfo=%7B%22title%22%3A%229th%20Circuit%20holds%20that%20scraping%20a%20public%20website%20does%20not%20violate%20the%20CFAA%20%5Bpdf%5D%22%7D");

        assert.exists(parsedURL);

        const previewURL = PreviewURLs.createPreviewURL(parsedURL!.target, parsedURL!.docInfo);

        console.log(previewURL);

        const params = URLParams.parse(previewURL);

        const docInfo = JSON.parse(params.get('docInfo')!);
        assert.equal(docInfo.title, "9th Circuit holds that scraping a public website does not violate the CFAA [pdf]");

    });

});
