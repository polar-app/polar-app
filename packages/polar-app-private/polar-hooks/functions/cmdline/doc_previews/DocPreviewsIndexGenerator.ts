import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {DocPreview} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";

export class DocPreviewsIndexGenerator {

    public static async generate() {

        const app = FirebaseAdmin.app();

        const firestore = app.firestore();

        const snapshot = await firestore.collection('doc_preview')
                                        .limit(5000)
                                        .get();

        const docPreviews = snapshot.docs.map(doc => doc.data() as DocPreview)
                                         .filter(current => current.cached);

        console.log("Found N records: " + docPreviews.length);

        const toHTML = () => {

            console.log("---\n" +
                "title: Doc Preview\n" +
                "layout: default\n" +
                "---\n");

            console.log(`<div class="container">`);

            for (const docPreview of docPreviews) {

                if (! docPreview.cached) {
                    continue;
                }

                const href = DocPreviewURLs.create({
                    id: docPreview.urlHash,
                    category: docPreview.category,
                    title: docPreview.title,
                    slug: docPreview.slug,
                });

                // put additional metadata here including author information
                console.log('<p>');
                console.log(`<a href="${href}">${docPreview.title}</a>`);
                console.log('</p>');
            }

            console.log("</div>");

        };

        toHTML();

    }

}

DocPreviewsIndexGenerator.generate()
    .catch(err => console.error(err));
