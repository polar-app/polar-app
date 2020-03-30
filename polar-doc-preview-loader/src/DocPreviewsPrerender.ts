import {DocPreviews} from "polar-firebase/src/firebase/om/DocPreviews";
import {FirebaseAdmin} from "polar-firebase-admin/src/FirebaseAdmin";
import {SendToQueue} from "./SendToQueue";
import {DocPreviewURLs} from "../../../polar-app-public/polar-webapp-links/src/docs/DocPreviewURLs";

const DEFAULT_LIMIT = 10;
// const DEFAULT_LIMIT = 50000;

export class DocPreviewsPrerender {

    public static async load() {

        const app = FirebaseAdmin.app();

        const docPreviews = await DocPreviews.list({size: DEFAULT_LIMIT});

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
