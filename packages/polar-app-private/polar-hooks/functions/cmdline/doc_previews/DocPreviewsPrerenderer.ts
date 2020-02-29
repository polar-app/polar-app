import {FirebaseAdmin} from "../../impl/util/FirebaseAdmin";
import {DocPreview} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";
import {Fetches} from "polar-shared/src/util/Fetch";

export class DocPreviewsPrerenderer {

    public static async generate() {

        const app = FirebaseAdmin.app();

        const firestore = app.firestore();

        const snapshot = await firestore.collection('doc_preview')
                                        .limit(5000)
                                        .get();

        const docPreviews = snapshot.docs.map(doc => doc.data() as DocPreview)
                                         .filter(current => current.cached);

        const doPrerender = async () => {

            for (const docPreview of docPreviews) {

                const href = DocPreviewURLs.create({
                    id: docPreview.urlHash,
                    category: docPreview.category,
                    title: docPreview.title
                });

                console.log(href);

                const body = JSON.stringify({
                    "prerenderToken": "nHFtg5f01o0FJZXDtAlR",
                    "url": href
                });

                const response = await Fetches.fetch('https://api.prerender.io/recache', {
                    method: "POST",
                    body,
                    headers: {
                        'content-type': 'application/json'
                    }
                });

                // console.log(response);
                if (response.status !== 200) {
                    console.warn(`Invalid response: ${response.status}: ${response.statusText}`);
                }

            }

        };

        await doPrerender();

    }

}

DocPreviewsPrerenderer.generate()
    .catch(err => console.error(err));
