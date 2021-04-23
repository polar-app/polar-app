import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {DocPreview} from "polar-firebase/src/firebase/om/DocPreviews";

export class DocPreviewsDocImporterGenerator {

    public static async generate() {

        const app = FirebaseAdmin.app();

        const firestore = app.firestore();

        const snapshot = await firestore.collection('doc_preview')
                                        .limit(5000)
                                        .get();

        const docPreviews = snapshot.docs.map(doc => doc.data() as DocPreview)
                                         .filter(current => ! current.cached);

        for (const docPreview of docPreviews) {

            const url = `https://app.getpolarized.io/doc-preview-import/${docPreview.url}`;
            console.log(url);

        }

    }

}

DocPreviewsDocImporterGenerator.generate()
    .catch(err => console.error(err));
