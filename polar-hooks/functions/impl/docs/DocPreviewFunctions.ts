import * as functions from "firebase-functions";
import {AddURLs} from "polar-webapp-links/src/docs/AddURLs";
import {DatastoreFetchImports} from "../datastore/DatastoreFetchImports";
import {ExpressRequests} from "../util/ExpressRequests";
import {
    DocPreviewURL,
    DocPreviewURLs,
} from "polar-webapp-links/src/docs/DocPreviewURLs";
import {
    DocPreviewCached,
    DocPreviews, DocPreviewUncached
} from "polar-firebase/src/firebase/om/DocPreviews";
import {DocPreviewHashcodes} from "polar-firebase/src/firebase/om/DocPreviewHashcodes";
import {Slugs} from "polar-shared/src/util/Slugs";

/**
 * This function takes a document via HTTP POST, performs an analysis on it, then
 * indexes its metadata using various APIs, then writes it to the index so that
 * we have the correct metadata we need.
 *
 * TODO:
 *
 * - the metadata we have from fatcat and unpaywall doesn't have a summary
 * - pubmed DOES have extended metadata but not everything has a pmid
 */
export const DocPreviewFunction = functions.https.onRequest(async (req, res) => {

    // TODO: accept a POST here with the data int the body with the proper mine type

    const fullURL = ExpressRequests.toFullURL(req);

    console.log(`Handling full URL: ${fullURL}`);

    const parsedURL = AddURLs.parse(fullURL);
    
    if (! parsedURL) {
        throw new Error("Wrong URL: " + fullURL);
    }

    // this will return immediately due to the cache after the first
    const importedDoc = await DatastoreFetchImports.doFetch(parsedURL.target);

    const urlHash = DocPreviewHashcodes.urlHash(parsedURL.target);

    const docPreview = await DocPreviews.get(urlHash);

    console.log("Parsed URL as: " + JSON.stringify(parsedURL, null, "   "));
    console.log("Imported doc to: " + JSON.stringify(importedDoc, null, "   "));

    if (docPreview) {

        const slug = docPreview.title ? Slugs.calculate(docPreview.title) : undefined;

        const updateDocPreviewCache = async (docPreview: DocPreviewCached | DocPreviewUncached) => {

            if (docPreview.cached) {
                // already cached.
                return;
            }

            console.log("Updating doc_preview cache");

            await DocPreviews.set({
                ...docPreview,
                docHash: importedDoc.hashcode,
                cached: true,
                datastoreURL: importedDoc.storageURL,
                slug
            });

        };

        await updateDocPreviewCache(docPreview);

        const redirectURL = DocPreviewURLs.create({
            id: urlHash,
            category: docPreview.category,
            title: docPreview.title,
            slug,
        });

        res.redirect(redirectURL);

    } else {

        const redirectURL = DocPreviewURLs.create({
            id: urlHash,
            category: undefined,
            title: undefined,
            slug: undefined
        });

        res.redirect(redirectURL);

    }

});
