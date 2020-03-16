import * as functions from "firebase-functions";
import {DocPreviews} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";

export const DocPreviewSitemapFunction = functions.https.onRequest((req, resp) => {

    const handler = async () => {

        resp.contentType('text/xml');
        resp.charset = 'UTF-8';

        resp.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
        resp.write(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`);

        const docPreviews = await DocPreviews.list(50000);

        for (const docPreview of docPreviews) {

            if (! docPreview.cached) {
                // do not generate links for anything that is not cached to
                // prevent 404s for Google.
                continue;
            }

            const url = DocPreviewURLs.create({
                id: docPreview.urlHash,
                category: docPreview.category,
                title: docPreview.title,
                slug: docPreview.slug
            });

            resp.write(`<url>\n`);
            resp.write(`<loc>${url}</loc>\n`);
            resp.write(`</url>\n`);
        }

        resp.write(`</urlset>\n`);
        resp.end();

    };

    handler().catch(err => {
        console.error(err);
        resp.sendStatus(500);
    });

});
