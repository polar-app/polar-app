import {DocPreviews} from "polar-firebase/src/firebase/om/DocPreviews";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

describe('DocPreviewSitemapFunction', function() {

    it("basic", async function() {

        FirebaseAdmin.app();

        const docPreviews = await DocPreviews.list({size: 50000});

    });

});
