import * as functions from "firebase-functions";
import {Group} from "../groups/db/Groups";
import {Collections} from "polar-firestore-like/src/Collections";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import OrderByClause = Collections.OrderByClause;

/**
 * The high level sitemap for the entire site.
 */
export const Sitemap = functions.https.onRequest((req, resp) => {

    const createIterator = async () => {

        const firestore = FirestoreAdmin.getInstance();

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['created', 'asc'],
            ['id', 'asc'],
        ];

        return await Collections.iterate<Group>(firestore, 'group', [['visibility', '==', 'public']], {orderBy, limit: 500});

    };

    const handler = async () => {

        console.log("Serving sitemaps...");

        const iterator = await createIterator();

        resp.contentType('text/xml');
        resp.charset = 'UTF-8';

        resp.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
        resp.write(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`);

        while (iterator.hasNext()) {

            const page = await iterator.next();

            // TODO: we can get the most RECENT updated doc annotation in that group to see when it was last updated
            // to trigger a crawl.
            for (const group of page) {
                resp.write(`<sitemap><loc>https://app.getpolarized.io/sitemaps/group/${group.id}</loc></sitemap>\n`);
            }

        }

        resp.write(`</sitemapindex>\n`);
        resp.end();

    };

    handler().catch(err => {
        console.error(err);
        resp.sendStatus(500);
    });

});
