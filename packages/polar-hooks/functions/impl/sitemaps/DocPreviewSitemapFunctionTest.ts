import {DocPreviewCollection} from "polar-firebase/src/firebase/om/DocPreviewCollection";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

xdescribe('DocPreviewSitemapFunction', function() {

    it("basic", async function() {

        FirebaseAdmin.app();

        const firestore = await FirestoreAdmin.getInstance();

        const docPreviews = await DocPreviewCollection.list(firestore, {size: 50000});

    });

});
