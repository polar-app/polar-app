import {DocPreviewCollection} from "polar-firebase/src/firebase/om/DocPreviewCollection";
import {SendToQueue} from "./SendToQueue";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";
import {Arrays} from "polar-shared/src/util/Arrays";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";

// const DEFAULT_LIMIT = 5000;
const DEFAULT_LIMIT = 50000;

export class DocPreviewsPrerender {

    public static async load() {

        const firestore = FirestoreAdmin.getInstance();

        const rawDocPreviews = await DocPreviewCollection.list(firestore, {size: DEFAULT_LIMIT});
        const docPreviews = Arrays.shuffle(...rawDocPreviews);

        console.log("Working with N doc previews: " + docPreviews.length);

        let processed: number = 0;

        for (const docPreview of docPreviews) {

            if (! docPreview.cached) {
                continue;
            }

            const url = DocPreviewURLs.create({
                id: docPreview.urlHash,
                category: docPreview.category,
                title: docPreview.title,
                slug: docPreview.slug
            });


            console.log("Going to cache URL: " + url);
            await SendToQueue.send(url, {'User-Agent': 'Googlebot '});

            ++processed;

            // console.log("Import URL: " + );

        }

        console.log("processed: " + processed);

    }

}

DocPreviewsPrerender.load()
    .catch(err => console.error("Could not load doc previews: ", err));
