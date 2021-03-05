import * as functions from "firebase-functions";
import {Group, Groups} from "../groups/db/Groups";
import {Arrays} from "polar-shared/src/util/Arrays";
import {Firestore} from "../util/Firestore";
import {Collections, OrderByClause} from "polar-firebase/src/firebase/Collections";
import {GroupDocAnnotation} from "../groups/db/doc_annotations/GroupDocAnnotations";

/**
 * Sitemaps for a specific group. This will return URLs that can be index as permalinks.
 */
export const GroupSitemap = functions.https.onRequest((req, resp) => {

    const getGroupID = () => {
        return Arrays.last(req.url.split("/"))!;

    };

    const getGroup = async () => {

        const groupID = getGroupID();
        const group = await Groups.get(groupID);

        if (! group) {
            throw new Error("No group with id: " + groupID);
        }

        if (group.visibility === 'private') {
            throw new Error("Group is private");
        }

        return group;

    };

    const createIterator = async (group: Group) => {

        const firestore = Firestore.getInstance();

        const collections = new Collections(firestore, 'group_doc_annotation');

        const orderBy: ReadonlyArray<OrderByClause> = [
            ['lastUpdated', 'desc'],
            ['id', 'asc'],
        ];

        return await collections.iterate<GroupDocAnnotation>([['groupID', '==', group.id]], {orderBy, limit: 500});

    };

    const handler = async () => {

        // https://app.getpolarized.io/group/Startups/highlight/1p623PiukyPiaLkbJeBCGLuxRsC6YpmuQq7BFinzoSRumnd1Qz

        console.log("Serving sitemaps...");

        const group = await getGroup();
        const iterator = await createIterator(group);

        resp.contentType('text/xml');
        resp.charset = 'UTF-8';

        resp.write(`<?xml version="1.0" encoding="UTF-8"?>\n`);
        resp.write(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`);

        // the main page of the group is a page that should be indexed.
        resp.write(`<url>\n`);
        resp.write(`<loc>https://app.getpolarized.io/group/${group.name}</loc>\n`);
        resp.write(`</url>\n`);

        while (iterator.hasNext()) {

            const page = await iterator.next();

            for (const groupDocAnnotation of page) {
                resp.write(`<url>\n`);
                resp.write(`<loc>https://app.getpolarized.io/group/${group.name}/highlight/${groupDocAnnotation.id}</loc>\n`);
                resp.write(`<lastmod>${groupDocAnnotation.lastUpdated}</lastmod>\n`);
                resp.write(`</url>\n`);
            }

        }

        resp.write(`</urlset>\n`);
        resp.end();

    };

    handler().catch(err => {
        console.error(err);
        resp.sendStatus(500);
    });

});
