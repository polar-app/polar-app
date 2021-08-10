import {DocPreviewCollection} from "polar-firebase/src/firebase/om/DocPreviewCollection";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {FirestoreBrowserClient} from "polar-firebase-browser/src/firebase/FirestoreBrowserClient";

describe('DocPreviewSitemapFunction', function() {

    it("basic", async function() {

        FirebaseAdmin.app();

        const firestore = await FirestoreBrowserClient.getInstance();

        const docPreviews = await DocPreviewCollection.list(firestore, {size: 50000});

    });

});
