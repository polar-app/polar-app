import {FirebaseAdmin} from "../../impl/util/FirebaseAdmin";
import {DocPreview} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";

export class DocPreviewsDocImporterGenerator {

    public static async generate() {

        const app = FirebaseAdmin.app();

        const firestore = app.firestore();

        const snapshot = await firestore.collection('doc_preview')
                                        .limit(1000)
                                        .get();

        const docPreviews = snapshot.docs.map(doc => doc.data() as DocPreview);

        for (const docPreview of docPreviews) {

            const url = `https://app.getpolarized.io/doc-preview-import/${docPreview.url}`;
            console.log(url);

        }

    }

}

DocPreviewsDocImporterGenerator.generate()
    .catch(err => console.error(err));
