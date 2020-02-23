import {FirebaseAdmin} from "../../impl/util/FirebaseAdmin";
import {DocPreview} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";

export class DocPreviewsSitemapGenerator {

    public static async generate() {

        const app = FirebaseAdmin.app();

        const firestore = app.firestore();

        const snapshot = await firestore.collection('doc_preview')
                                        .limit(1000)
                                        .get();

        const docPreviews = snapshot.docs.map(doc => doc.data() as DocPreview);

        for (const docPreview of docPreviews) {

            // const url = DocPreviewURLs.create({
            //     id: docPreview.urlHash,
            //     category: docPreview.category,
            //     title: docPreview.title
            // });

            const url = `https://app.getpolarized.io/preview/${docPreview.url}`;
            console.log(url);

        }

    }

}

DocPreviewsSitemapGenerator.generate()
    .catch(err => console.error(err));
