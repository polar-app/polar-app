import {DocPreviewCollection} from "polar-firebase/src/firebase/om/DocPreviewCollection";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";

describe('DocPreviewSitemapFunction', function() {

    it("basic", async function() {

        FirebaseAdmin.app();

        const docPreviews = await DocPreviewCollection.list({size: 50000});

    });

});
