import {DocPreviews} from "polar-firebase/src/firebase/om/DocPreviews";
import {FirebaseAdmin} from "../util/FirebaseAdmin";

describe('DocPreviewSitemapFunction', function() {

    it("basic", async function() {

        FirebaseAdmin.app();

        const docPreviews = await DocPreviews.list(50000);

    });

});
