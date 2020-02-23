import {FirebaseAdmin} from "../../impl/util/FirebaseAdmin";
import {DocPreview} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";

export class DocPreviewsIndexGenerator {

    public static async generate() {

        const app = FirebaseAdmin.app();

        const firestore = app.firestore();

        const snapshot = await firestore.collection('doc_preview')
                                        .limit(1000)
                                        .get();

        const docPreviews = snapshot.docs.map(doc => doc.data() as DocPreview);

        const toHTML = () => {

            for (const docPreview of docPreviews) {

                const href = DocPreviewURLs.create({
                    id: docPreview.urlHash,
                    category: docPreview.category,
                    title: docPreview.title
                });

                console.log('<div>');
                console.log(`<a href="${href}">${docPreview.title}</a>`);
                console.log('</div>');
            }

        };

        toHTML();

    }

}

DocPreviewsIndexGenerator.generate()
    .catch(err => console.error(err));
