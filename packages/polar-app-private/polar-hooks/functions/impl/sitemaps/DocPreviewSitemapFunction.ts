import * as functions from "firebase-functions";
import {
    DocPreviews,
    ListOpts,
    Range
} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewURLs} from "polar-webapp-links/src/docs/DocPreviewURLs";

export const DocPreviewSitemapFunction = functions.https.onRequest((req, resp) => {

    /**
     * Parse the options from the HTTP request so that we can change
     * the start/end range and limit and then use multiple sitemap URLs to
     * split things up properly.
     */
    const parseListOpts = (): ListOpts => {

        function toParam(key: string): string | undefined {

            const param = req.query[key];

            if (! param) {
                return undefined;
            }

            if (typeof param === 'string') {
                return param;
            }

            if (Array.isArray(param)) {
                return (<string> param[0]) || undefined;
            }

            throw new Error("Invalid param: " + param);

        }

        const parseRange = (): Range | undefined => {

            if (req.query.start && req.query.end) {
                return {
                    start: toParam('start')!,
                    end: toParam('end')!
                };
            }

            return undefined;

        };

        const parseSize = (): number => {

            const sizeParam = toParam('size');

            if (! sizeParam) {
                return 50000;
            }

            return parseInt(sizeParam);

        };

        const size = parseSize();
        const range = parseRange();

        return {size, range};

    };

    const handler = async () => {

        resp.contentType('text/xml');
        resp.charset = 'UTF-8';

        resp.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
        resp.write(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`);

        const opts = parseListOpts();

        console.log("Using list opts: ", opts);
        const docPreviews = await DocPreviews.list(opts);

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
